require 'mongo'

class KudosController
    
    def initialize
        @db = Mongo::Connection.new.db('kswizz')
    end
    
    def index(kenji)
        {hello: :world}
    end

    def count(kenji, id)
        posts = @db['posts']

        post = posts.find_one({tumblr_id: id})
        count = post['kudos'] unless post.nil?
        count ||= 0
        {count: count}
    end

    def increment(kenji, id)
        posts = @db['posts']

        post = posts.find_one({tumblr_id: id})
        post = {tumblr_id: id} unless post
        count = post['kudos']
        count ||= 0
        count += 1
        post['kudos'] = count
        posts.save(post)
        {count: count}
    end
end
