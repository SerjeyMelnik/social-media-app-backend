
import * as uuid from 'uuid';
import * as path from 'path';
import { Url } from 'node:url'
class FileService {
	saveFile(file) {
		try {
			const fileName = uuid.v4() + '.jpg';
			const filePath = path.resolve('static', fileName);
			file.mv(filePath);
			console.log(fileName);
			return fileName;
		} catch (error) {
			console.log(error)
		}
	}
}

export default new FileService();