const useStartDrag = (event, item) => {
  event.dataTransfer.setData('id', item.id)
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
}

export default useStartDrag