import * as configObj from '/config_public_alpine';

export const ssr = false;
export const prerender = false;

/** @type {import('./$types').PageLoad} */
export function load() {
    return {
        configObj
    };
}