require 'mongo'
#require 'memcache'

class KudosController < Kenji::Controller
    
  def initialize
    @db = Mongo::Connection.new('localhost').db('kswizz')
    #@cache = Memcache::NativeServer.new(:server => 'localhost:11211')
  end
    
  get '/' do
    {hello: kenji, db: @db}
  end

  get '/count/:id' do |id|
    kenji.header 'Access-Control-Allow-Origin' => '*'
        
    key = "kudos-#{id}"
    response = @cache.get(key) if @cache

    unless response
      posts = @db['posts']

      post = posts.find_one({tumblr_id: id})
      count = post['kudos'] unless post.nil?
      count ||= 0
      response = {count: count}

      @cache.set(key, response) if @cache
    end
    response
  end

  get '/increment/:id' do |id|
    kenji.header 'Access-Control-Allow-Origin' => '*'

    posts = @db['posts']

    post = posts.find_one({tumblr_id: id})
    post = {tumblr_id: id} unless post
    count = post['kudos']
    count ||= 0
    count += 1
    post['kudos'] = count
    
    posts.save(post)

    key = "kudos-#{id}"
    @cache.delete(key) if @cache
    
    {count: count}
  end
end
