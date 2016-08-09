import React from 'react';

class PageThree extends React.Component{
    render() {
        return(
            <div className="homeBox">
                <div className="aboutMe">
                    <img className="aboutMePhoto" src="../../images/Archie-Shi_sm.jpg" alt="" width="160px"/>
                    <p><span className="aboutMeName">史安琪（Archie&nbsp;Shi）</span>，90后编程爱好者。<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014年考取
                        <a href="http://baike.baidu.com/view/25317.htm" target="_blank">内蒙古大学</a>，
                        由于对编程的热爱，选择了软件工程专业。开始的时候是零基础，是<a href="http://www.hupeng.me/" target="_blank">胡鹏</a>
                        （我的舍友）带着我刷学校OJ，并在大一上半年期间取得了较高的排名。之后加入了
                        <a href="http://www.imudges.com/" target="_blank">IMUDGES</a>（内蒙古大学精英学生开发者联盟），
                        从此励志成为一名合格的
                        <a href="http://baike.baidu.com/view/12046150.htm" target="_blank">全栈工程师</a>
                        （Full Stack developer） ，并不断为之努力。
                        现如今，熟练掌握C++，Java，HTML，CSS，JavaScript，SQL，php，Python，NodeJs等多种语言，能够熟练编写复杂的
                        原生安卓应用，以及WebApp（ionic，React Native，PhoneGap）。熟练使用AngularJs，React，jQuery，ThinkPHP，
                        SSH，Express，MFC等前后端框架。以及Oracle，MySQL，Access，MongoDB等多种数据库。有很好的美术基础，能够非常好的使用
                        photoshop。
                        并且不断的学习新知识，紧追新技术，相信在不久的将来我会成为一名合格的全栈工程师。<br/>
                    </p>
                </div>
            </div>
        )
    }
}

module.exports = PageThree;