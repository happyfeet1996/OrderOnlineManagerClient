import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor() {}

  darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  ngOnInit(){
    if(this.darkModeMediaQuery.matches){
      this.changToDarkMode();
    }
    this.darkModeMediaQuery.addEventListener("change",(event)=>{
      if(event.matches){
        var link = this.changToDarkMode();
      }else{
        var links = document.getElementsByTagName('link');
        for (var i = 0; i < links.length; i++) {
          var link = links[i];
          // 检查 href 是否匹配要移除的 CSS 文件的路径
          if (link.getAttribute('href') === './assets/dark-ngzorro.css') {
            // 移除 link 元素
            link.parentNode?.removeChild(link);
            return;
          }
        }
      }
    })
  }

  private changToDarkMode() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './assets/dark-ngzorro.css'; // CSS 文件的路径


    // 将 link 元素添加到 head 中
    document.head.appendChild(link);
    return link;
  }
}
