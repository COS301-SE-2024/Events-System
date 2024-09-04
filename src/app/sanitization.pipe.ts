import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}


  transform(value: string): SafeHtml {
    // Custom sanitization logic using Regex
    return this.customSanitize(value);
  }


  private customSanitize(value: string): string {
    // Remove script tags
    value = value.replace(/<script.*?>.*?<\/script>/gi, '');        //remove : <script>...</script>


    // Remove event handlers
    value = value.replace(/on\w+=".*?"/gi, '');     //remove : on<event>=""


    // Remove common SQL injection patterns
    const sqlInjectionPatterns = [
        /--/g, /;/g, /\/\*/g, /\*\//g, /char/g, /nchar/g, /varchar/g, /nvarchar/g,
        /alter/g, /begin/g, /cast/g, /declare/g, /delete/g, /drop/g,
        /end/g, /exec/g, /execute/g, /insert/g, /kill/g,
        /sys/g, /sysobjects/g, /syscolumns/g, /table/g,
    ];
    sqlInjectionPatterns.forEach(pattern => {
        value = value.replace(pattern, '');     //remove : --, ;, /*, */, @, char, nchar, varchar, nvarchar, alter, begin, cast, declare, delete, drop, end, exec, execute, insert, kill, sys, sysobjects, syscolumns, table
    });


    // Remove all HTML tags
    value = value.replace(/<\/?[^>]+(>|$)/g, '');       //remove : <, >, </, />


    // Remove potentially dangerous characters
    const dangerousCharacters = /[<>;&"/\\#%*+=|^~]/g;    //remove : <, >, ;, &, ", /, \, #, %, *, +, =, |, ^, ~
    value = value.replace(dangerousCharacters, '');


    return value;
    }
}
