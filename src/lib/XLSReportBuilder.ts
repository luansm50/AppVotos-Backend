var StringBuffer = require("stringbuffer");
import fs from 'fs';
import { RowParameters } from '../api/models/types';

export default class XLSReportBuilder {

	private columns: RowParameters[];
	private sb;

	constructor(columns: RowParameters[]) {
		this.columns = columns;
		this.sb = new StringBuffer();
	}

	onStart() {
		var it: string = this.prolog();
		this.sb.append(it).append("\n");
	}

	onEntry(values: RowParameters[]) {
		var row: string = this.row(values);
		this.sb.append(row).append("\n");
	}

	row(values: RowParameters[]) {
		return this.toTag("td", values);
	}

	onEnd() {
		var it: string = this.epilog();
		this.sb.append(it).append("\n");
	}

	prolog() {
		var buffer = new StringBuffer();
		buffer
			.append("<html>\n")
			.append("\t<head>\n")
			.append("\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n")
			.append("\t\t<title>Relat&#243;rio Oystr</title>\n")
			.append("\t</head>\n")
			.append("\t<body>\n")
			.append("\t\t<style> td {mso-number-format:\\@; } body { font-family: 'Sans-serif'; } </style>\n")
			.append("\t\t<table>\n");


		const th = this.toTag("th", this.columns);
		buffer.append(th);

		return buffer.toString();
	}

	toTag(tag: string, array: RowParameters[]) {
		var buffer = new StringBuffer()
		buffer.append("\t\t\t<tr>\n");
		for (var i = 0; i < array.length; i++) {
			var it: String = array[i].value;
			buffer
				.append("\t\t\t\t<")
				.append(tag);

			if (array[i].color)
				buffer.append(" ").append("bgcolor=\"").append(array[i].color).append("\"");

			buffer.append(">")
				.append(it)
				.append("</").append(tag).append(">\n");
		}

		buffer.append("\t\t\t</tr>\n");
		return buffer.toString();
	}

	epilog() {
		return "\t\t</table>\n\t</body>\n</html>";
	}

	close(filePath: string) {
		var data = this.sb.toString();

		var callback = (err: any) => {
			if (err) throw err;
		}

		fs.writeFile(filePath, data, callback);
	}
}