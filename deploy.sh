#!/bin/sh
echo 'Copying dist to html'
cp -vr bean/dist/* /var/www/bean.aomartin.co.uk/html
echo 'Deleting old /assets'
rm -r /var/www/bean.aomartin.co.uk/assets/
echo 'Moving dist/assets to /assets'
mv -v /var/www/bean.aomartin.co.uk/html/assets/ /var/www/bean.aomartin.co.uk/
echo 'Reloading nginx'
systemctl reload nginx

# old
# cp -v html/index.html /var/www/bean.aomartin.co.uk/html
