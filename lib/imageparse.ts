import { IncomingForm } from "formidable";

export const config = {
    api : {
      bodyParser: false,
    }
  }

export interface FormParseResults {
    files: any
    fields: any
}

export const parseImageForm = async (req) => {
    const results: FormParseResults = await new Promise((resolve, reject)=>{
        const form = new IncomingForm({keepExtensions: true});
        form.parse(req, (err, fields, files)=>{
            if (err) return reject(err);
            resolve({fields, files});
        });
    });

    return results;
}