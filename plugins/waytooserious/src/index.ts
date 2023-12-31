import { commands } from "@vendetta";
import { findByProps } from "@vendetta/metro";

const MessageActions = findByProps("sendMessage", "receiveMessage");
const Locale = findByProps("Messages");


// This plugin is HEAVILY inspired by other plugins and the urge to get plugdetta
let patches = [];
const rep_list = [["u", "you"],
    ["wat", "what"],
    ["oh", "Fuck you"],
    ["dat", "that"],
    ["im", "I am"],
    ["imma", "I'm going to"]];

const serious_list = [".",
    "..",
    ", seriously.",
    " smh.",];

function pick_shit(main_array) {
    const rand_i = Math.floor(Math.random() * main_array.length);
    return main_array[rand_i];
}
const isOneCharacterString = (str: string): boolean => {
    return str.split('').every((char: string) => char === str[0]);
};

function replaceText(inputString) {
    let changed = false;
    for (const replacement of rep_list) {
        const regex = new RegExp(`\\b${replacement[0]}\\b`, "gi");
        if (regex.test(inputString)) {
            inputString = inputString.replace(regex, replacement[1]);
            changed = true;
        }
    }
    return changed ? inputString : false;
}

function be_serious(message: string): string {
    let resp = "";
    const rule = /\S+|\s+/g;
    const words: string[] | null = message.match(rule);

    if (words === null) return "";

    // allow urls
    for (let i = 0; i < words.length; i++) {
        if (isOneCharacterString(words[i]) || words[i].startsWith("https://")) {
            resp += words[i];
            continue;
        }

        if (!replaceText(words[i])) {
            resp += words[i]
                .replace(/n(?=[aeo])/g, "ny")
                .replace(/l|r/g, "w");
        } else resp += replaceText(words[i]);

    }

    resp += pick_shit(serious_list);
    return resp;
}

function array_serious(arr) {
    const new_array = [...arr];

    new_array.forEach((item, index) => {
        if (Array.isArray(item)) {
            new_array[index] = array_serious(item);
        } else if (typeof item === "string") {
            new_array[index] = be_serious(item);
        }
    });

    return new_array;
}

export default {
    onLoad: () => {
        patches.push(commands.registerCommand({
            name: "Waytooserious",
            displayName: "Waytooserious",
            description: "This is unfunny. I'll let you know I have lawyers working for me.",
            displayDescription: "This is unfunny. I'll let you know I have lawyers working for me.",
            options: [{name: "message",
                displayName: "message",
                description: Locale.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,
                displayDescription: Locale.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,
                required: true,
                type: 3}],
            applicationId: -1,
            inputType: 1,
            type: 1,
        
            execute: (main_arrays, ctx) => {
                MessageActions.sendMessage(ctx.channel.id, {
                    content: be_serious(main_arrays[0].value)
                })
            }
        }));
    },
    onUnload: () => {
        for (const unpatch of patches) unpatch()
    }
}
