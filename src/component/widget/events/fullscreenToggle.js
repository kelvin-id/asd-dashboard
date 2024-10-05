function toggleFullScreen (widget) {
  const isFullScreen = widget.classList.contains('fullscreen')

  if (isFullScreen) {
    widget.classList.remove('fullscreen')
    document.removeEventListener('keydown', handleEscapeKey)
    console.log('Exited full-screen mode')
  } else {
    widget.classList.add('fullscreen')
    document.addEventListener('keydown', handleEscapeKey)
    console.log('Entered full-screen mode')
  }
}

function handleEscapeKey (event) {
  if (event.key === 'Escape') {
    const fullScreenWidget = document.querySelector('.widget-wrapper.fullscreen')
    if (fullScreenWidget) {
      toggleFullScreen(fullScreenWidget)
    }
  }
}

// function initializeFullScreenToggle(widgetWrapper) {
//     const fullScreenButtons = document.querySelectorAll('.fullscreen-btn');
//     fullScreenButtons.forEach(button => {
//         button.addEventListener('click', event => {
//             event.preventDefault();
//             const widget = event.target.closest('.widget-wrapper');
//             toggleFullScreen(widget);
//         });
//     });
//     console.log('Full-screen toggle initialized');
// }

export { toggleFullScreen }
