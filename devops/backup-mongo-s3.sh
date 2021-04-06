#!/bin/bash -e

backup_name="ibouge-mongob.$(date +%Y%m%d)"
dumpdir="/data/db-backup/$backup_name"
backup_s3_path="s3://ibouge-backup/ibouge-mongodb"

mongodump --out "$dumpdir"
cd "$dumpdir"
tar cpjvf - "$dumpdir" | aws s3 cp - "$backup_s3_path/$backup_name.tar.bz2"
find /data/db-backup -maxdepth 1 -type d -mtime +31 -name 'ibouge-mongodb*' -exec rm -rvf {} +
aws s3 ls "$backup_s3_path/"
