// import './index.scss';
import "./index.html";
import "../../common";
import Swiper from "swiper";

console.log($(".header"));
// alert("我是index");

$(document).ready(function() {
    new Swiper(".swiper-container", {
        autoplay: true //可选选项，自动滑动
    });
});
