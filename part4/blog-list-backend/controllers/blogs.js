const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })
    try {
        if(!body.title && !body.url) {
            response.status(400).end()
        }
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
    } catch(exception) {
        next(exception)
    }

})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {

    try {
        const updatedBlog = 
            await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
        console.log(updatedBlog)
        response.json(updatedBlog.toJSON())
        
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogsRouter