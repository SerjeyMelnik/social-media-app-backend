
import * as uuid from 'uuid';
import * as path from 'path';
const API_URL = process.env.API_URL;
class FileService {
	saveFile(file) {
		try {
			const fileName = uuid.v4() + '.jpg';
			const filePath = path.resolve('static', fileName);
			file.mv(filePath);
			console.log(fileName);
			const linkToPicture = API_URL + '/' + fileName;
			return { fileName, linkToPicture };
		} catch (error) {
			console.log(error)
		}
	}
}

export default new FileService();