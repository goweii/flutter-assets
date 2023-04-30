export function toLowerCamelCase(splits: string[]): string {
    let name = '';
    for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        if (split.length === 0) { continue; }
        name += lowerCamelCase(split);
    }
    return name;
}

export function toUpperCamelCase(splits: string[]): string {
    let name = '';
    for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        if (split.length === 0) { continue; }
        name += upperCamelCase(split);
    }
    return name;
}

export function toSnakeCase(splits: string[]): string {
    let name = '';
    for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        if (split.length === 0) { continue; }
        if (name.length > 0) { name += "_"; }
        name += split;
    }
    return name;
}

export function toLowerSnakeCase(splits: string[]): string {
    let name = '';
    for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        if (split.length === 0) { continue; }
        if (name.length > 0) { name += "_"; }
        name += split.toLowerCase();
    }
    return name;
}

export function toUpperSnakeCase(splits: string[]): string {
    let name = '';
    for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        if (split.length === 0) { continue; }
        if (name.length > 0) { name += "_"; }
        name += split.toUpperCase();
    }
    return name;
}

function upperCamelCase(name: string): string {
    if (name.length === 0) { return name; }
    if (name.length === 1) { return name.toUpperCase(); }
    return name[0].toUpperCase() + name.substring(1);
}

function lowerCamelCase(name: string): string {
    if (name.length === 0) { return name; }
    if (name.length === 1) { return name.toLowerCase(); }
    return name[0].toLowerCase() + name.substring(1);
}