apt-get update -oAcquire::AllowInsecureRepositories=true -y

Hit:1 http://deb.debian.org/debian bookworm InRelease

Hit:2 http://deb.debian.org/debian bookworm-updates InRelease

Hit:3 http://deb.debian.org/debian-security bookworm-security InRelease

Get:4 https://notesalexp.org/tesseract-ocr5/bookworm bookworm InRelease [16.9 kB]

Ign:4 https://notesalexp.org/tesseract-ocr5/bookworm bookworm InRelease

Get:5 https://notesalexp.org/tesseract-ocr5/bookworm bookworm/main amd64 Packages [54.8 kB]

Fetched 71.7 kB in 2s (37.2 kB/s)

fatal error in libgcrypt, file ../../src/misc.c, line 92, function _gcry_fatal_error: requested algo not in md context
 
Fatal error: requested algo not in md context

Aborted
 

export GCRY_SECMEM_FLAG=0
export LIBGCRYPT_FORCE_FIPS_MODE=0

https://notesalexp.org/tesseract-ocr/packages5/en/debian/bookworm/amd64/tesseract-ocr/download.html


RUN apt-get install apt-transport-https -y
RUN echo "deb https://notesalexp.org/tesseract-ocr5/bookworm/ bookworm main" >> /etc/apt/sources.list
RUN apt-get update -oAcquire::AllowInsecureRepositories=true -y
RUN apt-get install notesalexp-keyring -oAcquire::AllowInsecureRepositories=true --allow-unauthenticated -y
RUN apt-get update && apt-get install \
    tesseract-ocr-eng tesseract-ocr-deu tesseract-ocr-rus \
    tesseract-ocr-chi-sim tesseract-ocr-jpn tesseract-ocr-kor \
    -y --allow-unauthenticated
