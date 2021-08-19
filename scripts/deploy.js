const {exec} = require('child_process')
exec('npm run build',(error,stdout,stderr)=>{
    if(error){
        console.log(error)
        return
    }
    console.log('stdout: ', stdout);
    exec('cd ../docs/.vuepress/dist',()=>{
        exec('git init',()=>{
            exec('git add -A',()=>{
                exec("git commit -m 'deploy'",()=>{
                    exec('git push -f git@github.com:wzp-coding/wzp-coding.github.io.git master',()=>{
                        console.log('deploy success');
                        exec('cd -')
                    })
                })
            })
        })
    })
})