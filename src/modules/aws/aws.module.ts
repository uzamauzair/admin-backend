import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk'; // Import S3 from AWS SDK

@Module({
    providers: [
        {
            provide: S3,
            useValue: new S3(), // Create a new instance of S3
        },
    ],
    exports: [S3], // Export S3 for injection in other modules/services
})
export class AwsModule {}
