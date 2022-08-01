import FileService from "./FileService.js"
import Post from "./Post.js"
const HOST = process.env.HOST;


class PostService {
	async create(post, picture) {
		const fileName = FileService.saveFile(picture);
		const linkToPicture = HOST + '/' + fileName;
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
			newPost.picture = FileService.saveFile(picture);
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