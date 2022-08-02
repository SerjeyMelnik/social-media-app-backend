
import * as uuid from 'uuid';
import * as path from 'path';
const HOST = process.env.HOST;
class FileService {
	saveFile(file) {
		try {
			const fileName = uuid.v4() + '.jpg';
			const filePath = path.resolve('static', fileName);
			file.mv(filePath);
			console.log(fileName);
			const linkToPicture = HOST + '/' + fileName;
			return { fileName, linkToPicture };
		} catch (error) {
			console.log(error)
		}
	}
}

export default new FileService();