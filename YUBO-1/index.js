// 避免全局污染
(function () {
  // 简化提取
  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  // 音频播放列表
  const audioLists = [
    {
      id: 0,
      name: "sako",
      src: "./assets/莎可.wav"
    },
    {
      id: 1,
      name: "lia",
      src: "./assets/莉娅.wav"
    },
    {
      id: 2,
      name: "riki",
      src: "./assets/苏璃姬.wav"
    }
  ];

  // 存放获取的dom元素
  let doms = {};

  // 存储每个角色的音频对象，之后可以通过id来直接控制
  const audioEls = [];

  // 当前播放音频的索引
  let curPlayIndex = null;

  // ---- 初始化 ----
  function init() {
    // doms
    doms = {
      content: $(".container .content"),
      sako: $("#sako"),
      lia: $("#lia"),
      riki: $("#riki"),
      btns: $$(".warrior-btn"),
      bgs: $$(".warrior-bg")
    };

    createAudios(audioEls, audioLists);

    // 初始化音频和按钮事件
    document.addEventListener("click", function (e) {
      const el = e.target; // 拿到了当前点击的元素
      // 筛选出点击的元素是btn，才进一步操作
      if (el.className === "warrior-btn") {
        const parId = el.parentElement.id; // 拿到父元素的 id
        // 传入id，对音频进行处理
        exectAudio(parId);
      }
    });

    // 给所有的音频对象添加一个结束的监听事件
    audioEls.forEach(function (audioE, index) {
      audioE.addEventListener("ended", function () {
        // 重置
        curPlayIndex = null;
        doms.btns.forEach(function (item) {
          item.src = "./assets/play.png";
        });
        doms.bgs.forEach(function (item) {
          item.classList.remove("rotating");
        });
      });
    });
  }

  /**
   * 将每个角色的音频加入到音频对象数组里
   * @param {*} audioEls
   * @param {*} audioLists
   */
  function createAudios(audioEls, audioLists) {
    audioLists.forEach((chara, index) => {
      // 创建音频对象
      const audioE = new Audio(chara.src);
      // 加入到数组里面
      audioEls.push(audioE);
    });
  }

  // 监听所有元素是否已经加载完毕
  document.addEventListener("DOMContentLoaded", init);

  // ---- 交互 ----
  /**
   * 处理音频的播放、暂停、动画
   * @param {*} id 用户点击了某一个具体的元素: sako, lia, riki
   */
  function exectAudio(id) {
    console.log(id);

    // 当前所点击元素在音频播放列表里的索引值
    const idIndex = audioLists.find(function (item) {
      return item.name === id;
    }).id;

    // 当前播放音频的按钮和背景图
    const curBtn = doms[id].querySelector(".warrior-btn");
    const curBg = doms[id].querySelector(".warrior-bg");

    // 当前有音频在播放 并且 所点击的和正在播放的是一致的
    if (curPlayIndex !== null && curPlayIndex === idIndex) {
      // 重置这个正在播放的音频
      audioEls[curPlayIndex].pause();
      audioEls[curPlayIndex].currentTime = 0; // 重置时间

      // 更改这个播放音频的播放按钮的样式: 改成play
      curBtn.src = "./assets/play.png";
      curBg.classList.remove("rotating");
      curPlayIndex = null; // 重置当前播放的音频的索引值

      return;
    }

    // 当前有音频在播放 并且 所点击的和正在播放的不一致
    if (curPlayIndex !== null && curPlayIndex !== idIndex) {
      // 重置正在播放的音频
      audioEls[curPlayIndex].pause();
      audioEls[curPlayIndex].currentTime = 0; // 重置时间

      // 把所有按钮的样式都改成 play，并且把所有背景的旋转都重置
      doms.btns.forEach(function (item) {
        item.src = "./assets/play.png";
      });
      doms.bgs.forEach(function (item) {
        item.classList.remove("rotating");
      });
    }

    // 如果没有音频在播放，或者所有音频都暂停了，则播放所点击的音频，并把当前正在播放的音频索引指向它

    // 开始播放
    audioEls[idIndex].play();
    curPlayIndex = idIndex;
    curBtn.src = "./assets/pause.png";
    curBg.classList.add("rotating");
    console.log(curPlayIndex);
  }
})();
