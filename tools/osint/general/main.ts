import * as ink from 'https://deno.land/x/ink/mod.ts'

import { show } from '../../../utils/show.ts'
import { utils } from '../../../utils/utils.ts'
const _show = new show()
const _utils = new utils()

import { inOnWebsite } from "./isOnWebsite/main.ts"

import { generateEmailSimple, generateEmailUsername } from "./email/generator.ts"

export class Osint_general {
    public async init(){
        await this.main()
    }

    public async main() {
        //show the main menu
        await _show.show_osint_menu_general()
        let rep = await _utils.listenUserResponse(ink.colorize("[<red>You</red>] your choice"))
        if (rep == "1") {
            await this.generateEmail()
        } else if(rep == "@") {
            return
        } else if(rep == "2") {
            await this.checkEmailIsOnWebsite()
        } else {
            _show.log('Invalid choice')
        }
        await this.main()
    }


    //private part
    private async generateEmail(){
        _show.log("Mode: 1: Name & Lastname, 2: Username, @ exit")
        let rep = await _utils.listenUserResponse(ink.colorize("[<red>You</red>] your choice"))
        if (rep == "1") {
            let name = await _utils.listenUserResponse(ink.colorize("[<red>You</red>] name"))
            let lastname = await _utils.listenUserResponse(ink.colorize("[<red>You</red>] lastname"))
            let email = await generateEmailSimple(name, lastname)
            _show.log(`generated ${email.length} emails`)
            this.saveOutput(email.join("\n"))
        } else if (rep == "2") {
            let username = await _utils.listenUserResponse(ink.colorize("[<red>You</red>] username"))
            let email = await generateEmailUsername(username)
            _show.log(`generated ${email.length} emails`)
            this.saveOutput(email.join("\n"))
        } else if (rep == "@") {
            return
        } else {
            _show.log('Invalid choice')
        }
        await this.generateEmail()
    }

    private async checkEmailIsOnWebsite(){
        let email = await _utils.listenUserResponse(ink.colorize("[<red>You</red>] email"))
        let d = await new inOnWebsite().main(email)
        console.log()
        _show.log(`${ink.colorize("<blue>"+email+"</blue>")} has been scanned by on ${d.length} website`)
        for(let i = 0; i<d.length; i++){
            _show.log(`${ink.colorize("<blue>"+d[i].websiteURL+"</blue>")} email ${d[i].isOnWebsite.isOn ? ink.colorize("<green>is</green>") : ink.colorize("<red>is not</red>")} registrated ${d[i].isOnWebsite.message!="" ? "| "+d[i].isOnWebsite.message : ""}`)
        }
        _show.log(`Email ${ink.colorize("<blue>"+email+"</blue>")} has been found on: ${ink.colorize("<green>"+d.filter(x => x.isOnWebsite.isOn).length+"</green>")} website(s)`)
    }

    private saveOutput(output:string){
        Deno.mkdirSync("./db/out/", { recursive: true })
        let name = "out_" + new Date().toISOString().replace(/:/g, "-") + ".txt"
        Deno.writeTextFileSync("./db/out/" + name, output)
        _show.log(`Saved to ./db/out/${name}`)
    }
}