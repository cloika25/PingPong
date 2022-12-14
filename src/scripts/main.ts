import { settingMenu } from "../components/settingMenu";
import { Game } from "./game"

let actualGame: Game;
const gameContainer = document.getElementById('game');

const closeSettingMenu = () => {
  const tempSetting = document.getElementById('setting');
  if (tempSetting) {
    gameContainer?.removeChild(tempSetting)
  }
}

const openSettingDialog = () => {
  if (actualGame.openPause) {
    closeSettingMenu();
  } else {
    const settingMenuContainer = document.createElement('div');
    settingMenuContainer.id = 'setting';
    settingMenuContainer.innerHTML = settingMenu;
    gameContainer?.appendChild(settingMenuContainer);
    const continueBtn = document.getElementById('continue')
    const changeBackgroundColor = document.getElementById('changeBackgroundColor')
    if (continueBtn) {
      continueBtn.onclick = () => {
        closeSettingMenu();
        actualGame.pauseToggle()
      }
    }
    if (changeBackgroundColor) {
      changeBackgroundColor.onclick = () => {
        console.log('Open color picker')
      }
    }
  }

}

window.onload = () => {
  actualGame = new Game()
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    openSettingDialog();
    actualGame.pauseToggle();
  }
})