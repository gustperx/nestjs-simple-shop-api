import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    description: 'File upload',
    example: ['jpg', 'jpeg', 'png', 'gif'],
  })
  file: string;
}
