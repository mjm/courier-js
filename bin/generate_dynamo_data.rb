#!/usr/bin/env ruby

require 'json'
require 'ksuid'
require 'time'

$dir = ARGV.shift

def load_file(name)
  JSON.parse(File.read(File.join($dir, "#{name}.json")))
end

def load_file_by_id(name)
  Hash[load_file(name).map {|row| [row["guid"], row]}]
end

def load_data_by_id
  $feeds_by_guid = load_file_by_id('feeds')
  $feed_subs_by_guid = load_file_by_id('feed_subscriptions')
  $posts_by_guid = load_file_by_id('posts')
  $tweets_by_guid = load_file_by_id('tweets')
end

def convert_time(time)
  Time.parse("#{time}Z").iso8601
end

def generate_feeds
  $feeds = []
  $feed_sub_ids = {}
  $feed_ids = {}

  $feed_subs_by_guid.values.each do |sub|
    if !sub['discarded_at'].nil?
      next
    end

    feed = $feeds_by_guid.fetch(sub["feed_guid"])

    id = KSUID.new.to_s
    $feed_sub_ids[sub['guid']] = id
    $feed_ids[feed['guid']] = id

    sk = "FEED##{id}"
    new_feed = {
      "PK" => "USER##{sub['user_id']}",
      "SK" => sk,
      "LSI1SK" => "FEED##{feed['title']}",
      "GSI1PK" => "HOMEPAGE##{feed['home_page_url']}",
      "GSI1SK" => sk,
      "GSI2PK" => sk,
      "GSI2SK" => sk,
      "Type" => "Feed",
      "URL" => feed['url'],
      "Autopost" => sub['autopost'],
      "CreatedAt" => convert_time(sub['created_at']),
      "UpdatedAt" => convert_time(sub['updated_at']),
      "RefreshedAt" => convert_time(feed['refreshed_at']),
      "Title" => feed['title'],
      "HomePageURL" => feed['home_page_url'],
    }

    if feed['mp_endpoint'] != ""
      new_feed['MicropubEndpoint'] = feed['mp_endpoint']
    end

    if !feed['caching_headers'].nil?
      ch = JSON.parse(feed['caching_headers'])
      if !ch.nil?
        new_ch = {}
        if ch.key?('etag')
          new_ch['Etag'] = ch['etag']
        end
        if ch.key?('lastModified')
          new_ch['LastModified'] = ch['lastModified']
        end
        if !new_ch.empty?
          new_feed["CachingHeaders"] = new_ch
        end
      end
    end

    $feeds << new_feed
  end
end

def generate_posts
  $posts = []
  $post_ids = {}

  $posts_by_guid.values.each do |post|
    feed_id = $feed_ids[post.fetch('feed_guid')]
    if feed_id.nil?
      next
    end

    pub_at = post['published_at']
    if pub_at.nil?
      next
    end

    item_id = post.fetch('item_id')
    $post_ids[post['guid']] = item_id

    pk = "FEED##{feed_id}"
    sk = "POST##{item_id}"
    new_post = {
      "PK" => pk,
      "SK" => sk,
      "LSI1SK" => "POST##{convert_time(pub_at)}",
      "GSI2PK" => pk,
      "GSI2SK" => "POST##{convert_time(pub_at)}##{item_id}#ITEM",
      "Type" => "Post",
      "URL" => post['url'],
      "CreatedAt" => convert_time(post['created_at']),
      "UpdatedAt" => convert_time(post['updated_at']),
      "PublishedAt" => convert_time(pub_at),
    }

    if post['title'] != ""
      new_post['Title'] = post['title']
    else
      new_post['HTMLContent'] = post['html_content']
    end

    if !post['modified_at'].nil?
      new_post['ModifiedAt'] = convert_time(post['modified_at'])
    end

    $posts << new_post
  end
end

def generate_tweets
  $tweets = []
  $tweet_ids = {}
  $tweets_by_sk = {}

  $tweets_by_guid.values.each do |tweet|
    feed_id = $feed_sub_ids[tweet.fetch('feed_subscription_guid')]
    if feed_id.nil?
      next
    end

    item_id = $post_ids[tweet.fetch('post_guid')]
    if item_id.nil?
      next
    end

    sub = $feed_subs_by_guid.fetch(tweet.fetch('feed_subscription_guid'))
    post = $posts_by_guid.fetch(tweet.fetch('post_guid'))

    pub_at = convert_time(post.fetch('published_at'))

    pk = "USER##{sub.fetch('user_id')}"
    sk = "FEED##{feed_id}#TWEETGROUP##{item_id}"

    new_tweet = $tweets_by_sk[sk]
    if new_tweet.nil?
      new_tweet = {
        "PK" => pk,
        "SK" => sk,
        "GSI2PK" => "FEED##{feed_id}",
        "GSI2SK" => "POST##{pub_at}##{item_id}##TWEET",
        "Type" => "Tweet",
        "CreatedAt" => convert_time(post['created_at']),
        "UpdatedAt" => convert_time(post['updated_at']),
        "UpcomingKey" => "UPCOMING##{pub_at}",
        "URL" => post['url'],
      }

      case tweet['status']
      when 'draft'
        new_tweet["LSI1SK"] = new_tweet['UpcomingKey']
      when 'canceled'
        new_tweet['CanceledAt'] = new_tweet['UpdatedAt']
        new_tweet['LSI1SK'] = "PAST##{new_tweet['CanceledAt']}"
      when 'posted'
        new_tweet['PostedAt'] = convert_time(tweet['posted_at'])
        new_tweet['LSI1SK'] = "PAST##{new_tweet['PostedAt']}"
      end

      $tweets << new_tweet
      $tweets_by_sk[sk] = new_tweet
    end

    case tweet.fetch('action')
    when 'retweet'
      new_tweet['RetweetID'] = tweet['retweet_id']
      if tweet['posted_tweet_id'] != ""
        new_tweet['PostedRetweetID'] = tweet['posted_tweet_id']
      end

    when 'tweet'
      new_tweet['Tweets'] ||= []

      t = { 'Position' => tweet['position'] }
      if tweet['body'] != ''
        t['Body'] = tweet['body']
      end
      if tweet['media_urls'] != '{}'
        t['MediaURLs'] = tweet['media_urls'][1..-2].split(',')
      end
      if tweet['posted_tweet_id'] != ''
        t['PostedTweetID'] = tweet['posted_tweet_id']
      end

      new_tweet['Tweets'] << t
      new_tweet['Tweets'].sort! {|a,b| a['Position'] <=> b['Position'] }
    end

  end
end

load_data_by_id
generate_feeds
generate_posts
generate_tweets

all_items = $feeds + $posts + $tweets
File.write(File.join($dir, 'dynamo_items.json'), JSON.pretty_generate(all_items))