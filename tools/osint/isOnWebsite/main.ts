import { show } from '../../../utils/show.ts'
import { utils } from '../../../utils/utils.ts'
const _show = new show()
const _utils = new utils()

// this script check if email is on website
export class inOnWebsite {
    private mods = []

    private async loadMod(){
        let tmpmod = []
        let modCat = await this.exploreDirSimple("./tools/osint/isOnWebsite/mods/")
        for(let i = 0; i<modCat.length; i++){
            // need to load all the module
            let curModule = await this.exploreFileSimple("./tools/osint/isOnWebsite/mods/"+modCat[i]+"/")
            //add the curmodule to list
            for(let j = 0 ; j<curModule.length; j++){
                let m = {
                    cat: modCat[i],
                    name: curModule[j],
                    mod: await import("./mods/"+modCat[i]+"/"+curModule[j])
                }
                tmpmod.push(m)
            }
        }
        this.mods = tmpmod
        _show.log(`loaded ${this.mods.length} modules`)
    }

    private async exploreDirSimple(dir){
        let tmp = []
        for await (const dirEntry of Deno.readDir(dir)) {
            if(dirEntry.isDirectory){
                tmp.push(dirEntry.name)
            }
        }
        return tmp
    }

    private async exploreFileSimple(dir){
        let tmp = []
        for await (const dirEntry of Deno.readDir(dir)) {
            if(!dirEntry.isDirectory){
                tmp.push(dirEntry.name)
            }
        }
        return tmp
    }
    
    async main(email){
        await this.loadMod()
    
        //now the mods are load soo we can do some random shit
        let res = []

        // note that email "alina@live-hack.org" is registrated on all the website. so if the script sed "no" this meen there are an error
    
        for(let i = 0; i<this.mods.length; i++){
            let t = {
                isOnWebsite: await this.mods[i].mod.main(email),
                websiteURL: this.mods[i].mod.getURL(),
                timeStamp: Date.now()
            }
            res.push(t)
        }

        return res
    }
    
}