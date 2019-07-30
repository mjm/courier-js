/* tslint:disable */

export type tweet_status = 'canceled' | 'draft' | 'posted';

export namespace feed_subscriptionsFields {
    export type id = number;
    export type feed_id = number;
    export type user_id = string;
    export type autopost = boolean;
    export type created_at = Date;
    export type updated_at = Date;
    export type discarded_at = Date | null;

}

export interface feed_subscriptions {
    id: feed_subscriptionsFields.id;
    feed_id: feed_subscriptionsFields.feed_id;
    user_id: feed_subscriptionsFields.user_id;
    autopost: feed_subscriptionsFields.autopost;
    created_at: feed_subscriptionsFields.created_at;
    updated_at: feed_subscriptionsFields.updated_at;
    discarded_at: feed_subscriptionsFields.discarded_at;

}

export namespace eventsFields {
    export type id = number;
    export type user_id = string | null;
    export type event_type = string;
    export type parameters = Object;
    export type created_at = Date;

}

export interface events {
    id: eventsFields.id;
    user_id: eventsFields.user_id;
    event_type: eventsFields.event_type;
    parameters: eventsFields.parameters;
    created_at: eventsFields.created_at;

}

export namespace pgmigrationsFields {
    export type id = number;
    export type name = string;
    export type run_on = Date;

}

export interface pgmigrations {
    id: pgmigrationsFields.id;
    name: pgmigrationsFields.name;
    run_on: pgmigrationsFields.run_on;

}

export namespace feedsFields {
    export type id = number;
    export type url = string;
    export type title = string;
    export type home_page_url = string;
    export type refreshed_at = Date | null;
    export type created_at = Date;
    export type updated_at = Date;
    export type caching_headers = Object | null;
    export type mp_endpoint = string;

}

export interface feeds {
    id: feedsFields.id;
    url: feedsFields.url;
    title: feedsFields.title;
    home_page_url: feedsFields.home_page_url;
    refreshed_at: feedsFields.refreshed_at;
    created_at: feedsFields.created_at;
    updated_at: feedsFields.updated_at;
    caching_headers: feedsFields.caching_headers;
    mp_endpoint: feedsFields.mp_endpoint;

}

export namespace tweetsFields {
    export type id = number;
    export type post_id = number;
    export type feed_subscription_id = number;
    export type body = string;
    export type media_urls = Array<string>;
    export type status = tweet_status;
    export type posted_at = Date | null;
    export type posted_tweet_id = string;
    export type position = number;
    export type created_at = Date;
    export type updated_at = Date;
    export type post_after = Date | null;

}

export interface tweets {
    id: tweetsFields.id;
    post_id: tweetsFields.post_id;
    feed_subscription_id: tweetsFields.feed_subscription_id;
    body: tweetsFields.body;
    media_urls: tweetsFields.media_urls;
    status: tweetsFields.status;
    posted_at: tweetsFields.posted_at;
    posted_tweet_id: tweetsFields.posted_tweet_id;
    position: tweetsFields.position;
    created_at: tweetsFields.created_at;
    updated_at: tweetsFields.updated_at;
    post_after: tweetsFields.post_after;

}

export namespace postsFields {
    export type id = number;
    export type feed_id = number;
    export type item_id = string;
    export type text_content = string;
    export type html_content = string;
    export type title = string;
    export type url = string;
    export type published_at = Date | null;
    export type modified_at = Date | null;
    export type created_at = Date;
    export type updated_at = Date;

}

export interface posts {
    id: postsFields.id;
    feed_id: postsFields.feed_id;
    item_id: postsFields.item_id;
    text_content: postsFields.text_content;
    html_content: postsFields.html_content;
    title: postsFields.title;
    url: postsFields.url;
    published_at: postsFields.published_at;
    modified_at: postsFields.modified_at;
    created_at: postsFields.created_at;
    updated_at: postsFields.updated_at;

}
