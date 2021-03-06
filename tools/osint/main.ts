import * as ink from 'https://deno.land/x/ink/mod.ts'
import { show } from '../../utils/show.ts'
import { utils } from '../../utils/utils.ts'
const _show = new show()
const _utils = new utils()


import { Osint_general } from "./general/main.ts"
import { Osint_country } from "./country/main.ts"
import { Osint_services } from "./services/main.ts"

export class Osint {
    public async init(){
        _show.log("Starting osint...")
        await this.main()
    }

    private async main() {
        console.clear()
        _show.showWelcome()
        //show the main menu
        await _show.show_osint_menu()
        let rep = await _utils.listenUserResponse(ink.colorize("[<red>You</red>] your choice"))

        if (rep == "1") {
            await new Osint_general().main()
        } else if(rep == "2") {
            await new Osint_services().main()
        } else if(rep == "3") {
            await new Osint_country().main()
        } else if(rep == "@") {
            return
        } else {
            _show.log('Invalid choice')
        }
        await this.main()
    }
}