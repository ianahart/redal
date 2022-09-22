from io import BytesIO
from core import settings
import boto3
import os
import uuid
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import DatabaseError
from datetime import datetime
from random import randint
import logging
logger = logging.getLogger('django')

class FileUpload():

    def __init__ (self, file, folder=None):
        self.file = file
        self.folder = folder
        self.bucket_name = settings.AWS_BUCKET
        self.region_name = settings.AWS_DEFAULT_REGION
        self.aws_access_key_id = settings.AWS_ACCESS_KEY_ID
        self.aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY

        session = boto3.Session(
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            region_name = self.region_name
        )

        self.s3 = session.resource('s3')

    def delete(self, filename: str):
      try:
            self.s3.Object(self.bucket_name, filename).delete() #type:ignore
      except OSError:
            logger.error(msg='Failed deleting avatar file from AWS S3')



    def upload(self):
        filename, file_ext = os.path.splitext(str(self.file))

        self.__decode_file()
        file_path = self.__make_file_path(filename, file_ext)

        obj = self.s3.Object(self.bucket_name, file_path) #type:ignore
        file_ext = file_ext.replace('.', '')
        obj.put(
            Body=self.file,
            ACL='public-read',
            ContentType=f'image/{file_ext}'
        )

        url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{file_path}"
        if url is not None and file_path is not None:
            return  url,  file_path
        else:
            return None, None

    def __decode_file(self):

        try:
            self.file = self.file.read()
        except OSError:
            logger.error('Unable to read file being uploaded.')


    def __make_file_path(self, filename: str, file_ext: str) -> str:
        identifier = f"{randint(1000, 10000)}-{datetime.utcnow().strftime('%Y%m%d%H%M%SZ')}"
        file_path = f'{self.folder}/{identifier}-{filename}{file_ext}'

        return file_path


