/* istanbul ignore file */
export const VERSION = '3.1.0';

export const HELP = `
Usage: generate-next-links 

If no 'path' is specified, a 'pages' folder must be located
inside the folder where the script is running from

Options:
 -N --name     [NAME]         name of generated TypeScript enum
 -P --path     [PATH]         path to folder where 'pages' directory resides
 -O --out      [PATH]         path to folder where ts file will be written to
 -B --base     [PATH]         nextjs base path, defaults to '/'
 -S --tab-size [INT]          specify tab size used in generated file
 -A --api                     include API paths found in '/pages/api' folder
 -R --root                    include an 'ROOT' entry with path '/'
 -D --dry                     perform all operations except writing to disk
 -V --verbose                 show all log messages in stdout
 -T --omit-timestamp          omit timestamp from written ts file
 -J --export-json             export json instead of ts enum
 -C --convert-camel-case      convert camel case to be delimited by underscore
 -E --convert-hyphens         convert kebab case to be delimited by underscore
 -Q --single-quote            use single quotes in the generated file
 -I --version                 show current version
 -H --help                    show help                                                
`;
