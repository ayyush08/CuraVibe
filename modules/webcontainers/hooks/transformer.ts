interface TemplateItem {
    filename: string;
    fileExtension: string;
    content: string;
    folderName?: string;
    items?: TemplateItem[];
}

interface WebContainerFile {
    file: {
        contents: string;
    };
}

interface WebContainerDirectory {
    directory: {
        [key: string]: WebContainerFile | WebContainerDirectory;
    };
}

type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;

/**
 * Removes --turbopack flag from npm scripts in package.json
 * WebContainers don't support Turbopack compilation yet
 */
function removeTurbopackFromScripts(packageJsonContent: string): string {
    try {
        const pkg = JSON.parse(packageJsonContent);
        
        if (pkg.scripts && typeof pkg.scripts === 'object') {
            Object.keys(pkg.scripts).forEach(scriptName => {
                if (typeof pkg.scripts[scriptName] === 'string') {
                    // Remove --turbopack flag from all scripts
                    pkg.scripts[scriptName] = pkg.scripts[scriptName]
                        .replace(/\s*--turbopack\s*/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                }
            });
        }
        
        return JSON.stringify(pkg, null, 2);
    } catch (error) {
        // If it's not valid JSON, return original content
        return packageJsonContent;
    }
}

export function transformToWebContainerFormat(template: { folderName: string; items: TemplateItem[] }): WebContainerFileSystem {
    function processItem(item: TemplateItem): WebContainerFile | WebContainerDirectory {
        if (item.folderName && item.items) {
            // This is a directory
            const directoryContents: WebContainerFileSystem = {};

            item.items.forEach(subItem => {
                const key = subItem.fileExtension
                    ? `${subItem.filename}.${subItem.fileExtension}`
                    : subItem.folderName!;
                directoryContents[key] = processItem(subItem);
            });

            return {
                directory: directoryContents
            };
        } else {
            // This is a file - check if it's package.json and needs transformation
            let content = item.content;
            
            if (item.filename === 'package' && item.fileExtension === 'json') {
                content = removeTurbopackFromScripts(content);
            }
            
            return {
                file: {
                    contents: content
                }
            };
        }
    }

    const result: WebContainerFileSystem = {};

    template.items.forEach(item => {
        const key = item.fileExtension
            ? `${item.filename}.${item.fileExtension}`
            : item.folderName!;
        result[key] = processItem(item);
    });

    return result;
}