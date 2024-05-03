import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { S3 } from 'aws-sdk';
import * as multer from 'multer'
import * as multerS3 from 'multer-s3';

@Injectable()
export class S3FileInterceptor implements NestInterceptor {
    constructor(private readonly fieldName: string) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        // Initialize AWS S3 with credentials and configuration
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });

        // Configure multer-s3 for file upload to S3 bucket
        const upload = multer({
            storage: multerS3({
                s3,
                bucket: 'quickeats-items',
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key: (req, file, cb) => {
                    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const folder = 'items';
                    cb(null, `${folder}/${uniquePrefix}-${file.originalname}`);
                },
            }),
        }).array(this.fieldName, 10);

        // Handle the file upload using multer directly
        return new Observable((observer) => {
            upload(request, response, (err) => {
                if (err) {
                    console.error('File upload error:', err);
                    observer.error(err);
                } else {
                    // Attach files to the request object for the next handler
                    request.files = request.files || [];
                    // Check if files are already attached to avoid duplication

                    if (request.files.length === 0) {
                        request.files.push(...request.files.slice(0, request.files.length / 2));
                    }

                    // Continue with the next handler (controller)
                    next.handle().subscribe({
                        next: (data) => observer.next(data), // Forward data from the controller
                        error: (error) => observer.error(error), // Forward errors from the controller
                        complete: () => observer.complete(),
                    });
                }
            });
        });
    }
}
