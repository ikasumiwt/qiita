## rsync -a

### つくるもの

rsync -a のnode版
```
$ rsync -av src_test/ test/
building file list ... done
./
777.txt
message.json
sample.txt
symSample.txt -> ../symlink/symSample.txt

sent 399 bytes  received 98 bytes  994.00 bytes/sec
total size is 72  speedup is 0.14
```



### memo

symlinkしたときのchwonができてない

sample.txt参考にするとtimeが1分ズレてる (下は開発途中なのでまだ他のも足りてない)

```
ikasumi:rsync USER$ ls -la dest_test/
total 32
drwxr-xr-x  7 USER  staff  238  5 15 04:26 .
drwxr-xr-x  8 USER  staff  272  5 15 04:23 ..
-rw-r--r--  1 USER  staff   13  5 15 03:00 .gitignore
-rw-r--r--  1 USER  staff    4  5 15 00:22 777.txt
-rw-r--r--  1 USER  staff    0  5 15 04:24 root.txt
-rw-r--r--  1 USER  staff   19  5 15 00:21 sample.txt
lrwxr-xr-x  1 USER  staff   22  5 15 04:26 symSample.txt -> src_test/symSample.txt
ikasumi:rsync USER$ ls -la src_test/
total 32
drwxr-xr-x  7 USER  staff  238  5 15 04:25 .
drwxr-xr-x  8 USER  staff  272  5 15 04:27 ..
-rw-r--r--  1 USER  staff   13  5 15 03:00 .gitignore
-rwxrwxrwx  1 USER  staff    4  5 15 00:22 777.txt
-rw-r--r--  1 root  wheel    0  5 15 04:24 root.txt
-rw-r--r--  1 USER  staff   19  5 15 00:21 sample.txt
lrwxr-xr-x  1 USER  staff   24  5 15 00:24 symSample.txt -> ../symlink/symSample.txt

```

