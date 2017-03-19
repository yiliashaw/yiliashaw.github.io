(() => {
    const fs = require('fs');
    const markdown = require('markdown').markdown;
    const readline = require('readline');

    const readFirstLine = function(path) {
        return new Promise(function(resolve, reject) {
            const rs = fs.createReadStream(path, {
                encoding: 'utf8'
            });
            let acc = '';
            let pos = 0;
            let index;
            rs
                .on('data', function(chunk) {
                    index = chunk.indexOf('\n');
                    acc += chunk;
                    index !== -1 ? rs.close() : pos += chunk.length;
                })
                .on('close', function() {
                    resolve(acc.slice(0, pos + index));
                })
                .on('error', function(err) {
                    reject(err);
                })
        });
    };


    fs.readdir('posts/', (err, files) => {
        if (err) console.log(err);
        // console.log(files);
        const fileData = [];
        const files_md = files.filter((item) => {
            return item.slice(-2) === 'md'
        });

        let count = files_md.length;

        files_md.forEach((file) => {

            const fileInfo = {};

            const filename = file.slice(0, file.lastIndexOf('.'));

            const str = readFirstLine('posts/' + file).then(function(data) { //Promise

                fileInfo.title = data.slice(2).trim();

                fileInfo.name = filename;
                fileInfo.url = '/posts/' + filename + '.html';

                fs.stat('posts/' + file, (err, stats) => {
                    if (err) console.log('WRONG!' + err);

                    //atime:Acess Time; mtime:Modified Time; ctime:Change Time; birthtime:; birth Time
                    fileInfo.birthTime = stats.birthtime.getFullYear() + '.' + (stats.birthtime.getMonth() + 1) + '.' + stats.birthtime.getDate() + '  ' + stats.birthtime.getHours() + ':' + stats.birthtime.getMinutes();

                    fileInfo.modTime = stats.mtime.getFullYear() + '.' + (stats.mtime.getMonth() + 1) + '.' + stats.mtime.getDate() + '  ' + stats.mtime.getHours() + ':' + stats.mtime.getMinutes();

                    fileData.push(fileInfo);

                    count--;

                    if (count <= 0) {

                        fs.writeFile('post-data.json', JSON.stringify(fileData), (err) => {
                            if (err) throw err;
                            console.log('Posts data updated~!')
                        });

                    }

                });
            }, function(err) {
                console.log(err)
            })


            const postStr = fs.readFileSync('posts/' + file, 'utf8');
            const post = markdown.toHTML(postStr);
            // const postHead = fs.readFileSync('./archive/post-head.html', 'utf-8');
            // const postFooter = fs.readFileSync('./archive/post-footer.html', 'utf-8');

            const destFile = 'posts/' + filename + '.html';


            // const writeData = postHead + post + postFooter;

            // fs.truncate(destFile, 0, function() {
            //     console.log('reset html')
            // });

            // fs.writeFile(destFile, writeData, (err) => {
            //     if (err) throw err;
            //     console.log('success')
            // });


            const postLayout = fs.readFileSync('./archive/post.html', 'utf-8').replace('@@post',post);
            // console.log(postLayout);

            fs.writeFile(destFile, postLayout, (err) => {
                if (err) throw err;
                console.log('success')
            });
        });

    });
})();