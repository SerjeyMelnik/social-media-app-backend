
import Post from '../../Schemes/Post.js';
const HOST = process.env.API_URL;
import FileService from '../../Utils/FileService.js'

class PostService {
	async create(post, picture) {
		const { fileName, linkToPicture } = FileService.saveFile(picture);

		const createdPost = await Post.create({ ...post, picture: linkToPicture })
		return createdPost
	}
	async getAll() {

		const posts = await Post.find()
		return posts.reverse()
	}
	async getById(id) {

		if (!id) {
			throw new Error('Id is not specified')
		}
		const post = await Post.findById(id);
		return post

	}
	async update(postId, post, picture) {
		let newPost = { ...post };
		if (!postId) {
			throw new Error('Id is not specified')
		}
		if (picture) {
			const { fileName, linkToPicture } = FileService.saveFile(picture);

			newPost.picture = linkToPicture;
		}
		const updatedPost = await Post.findByIdAndUpdate(postId, newPost, { new: true })
		return updatedPost

	}
	async delete(id) {

		if (!id) {
			throw new Error('Id is not specified')
		}
		const deletedPost = await Post.findByIdAndDelete(id)
		return deletedPost

	}
}

export default new PostService();