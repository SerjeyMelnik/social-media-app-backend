import Post from './Post.js';
import PostService from './PostService.js';

class PostController {
	async create(req, res) {
		try {

			const post = await PostService.create(req.body, req.files.picture);
			return res.json(post)
		} catch (error) {

			res.status(500).json(error.message)
		}
	}
	async getAll(req, res) {
		try {
			const posts = await PostService.getAll()
			res.status(200).json(posts)

		} catch (error) {
			res.status(500).json(error)
		}
	}
	async getById(req, res) {
		try {
			const post = await PostService.getById(req.params.id);
			return res.json(post);
		} catch (error) {
			res.status(500).json(error.message)
		}
	}
	async update(req, res) {
		try {
			const post = req.body;
			const updatedPost = await PostService.update(post._id, post, req.files ? req.files.picture : null)

			return res.json(updatedPost)
		} catch (error) {
			console.log(error);
			res.status(500).json(error.message)

		}
	}
	async delete(req, res) {
		try {
			const deletedPost = await PostService.delete(req.params.id)
			return res.json(deletedPost)
		} catch (error) {
			res.status(500).json(error.message)

		}
	}
}
export default new PostController()