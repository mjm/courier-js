#!/usr/bin/env ruby

require 'json'
require 'aws-sdk-dynamodb'

TABLE_NAME = 'courier-production'

Aws.config.update({
  region: 'us-east-2'
})

dynamodb = Aws::DynamoDB::Client.new

items = JSON.parse(File.read(ARGV.first))

unwritten_items = []
errors = []

items.each_slice(25) do |batch|
  resp = dynamodb.batch_write_item({
    request_items: {
      TABLE_NAME => batch.map do |item|
        {
          put_request: {
            item: item,
          }
        }
      end
    }
  })

  unwritten_items += resp.unprocessed_items.fetch(TABLE_NAME, [])
  puts "Wrote some items."

rescue => e
  puts e

  unwritten_items += batch
end

if !unwritten_items.empty?
  puts "Was unable to process #{unwritten_items.size} items."
  File.write("#{ARGV.first}.unprocessed", JSON.pretty_generate(unwritten_items))
end