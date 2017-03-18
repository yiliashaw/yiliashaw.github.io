(() => {
    const fs = require('fs');
    const path = __dirname + '/../posts/';

    fs.readdir(path, (err, files) => {
        if (err) console.log(err);

        const fileData = [];
        
        let count = files.length;

        files.forEach((file) => {

            const filename = path + file + '/README.md';
            const fileInfo = {};
            fileInfo.name = file;
            fileInfo.url = 'posts/' + file;

            fs.stat(filename, (err, stats) => {
                if (err) console.log('WRONG!' + err);
                
                //atime:Acess Time; mtime:Modified Time; ctime:Change Time; birthtime:; birth Time
                fileInfo.birthTime = stats.birthtime.getFullYear() + '.' + (stats.birthtime.getMonth() + 1) + '.' + stats.birthtime.getDate() + '  ' + stats.birthtime.getHours() + ':' + stats.birthtime.getMinutes();

                fileInfo.modTime = stats.mtime.getFullYear() + '.' + (stats.mtime.getMonth() + 1) + '.' + stats.mtime.getDate() + '  ' + stats.mtime.getHours() + ':' + stats.mtime.getMinutes();

                fileData.push(fileInfo);

                count--;

                if (count <= 0) {

                    fs.writeFile(__dirname + '/../post-data.json', JSON.stringify(fileData), (err) => {
                        if (err) throw err;
                        console.log('Posts data updated~!')
                    });

                }

            });
        });

    });
})();