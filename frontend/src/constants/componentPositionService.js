export const calculatePos = (updatedItemIndex, updatedList) => {
  let pos

  if (updatedItemIndex === 0 && updatedList.length > 1) {
    pos = updatedList[1].pos / 2
  } else if (updatedItemIndex === 0) {
    pos = 65536
  } else if (updatedItemIndex === updatedList.length - 1) {
    pos = updatedList.at(-2).pos + 1024
  } else {
    pos = (updatedList[updatedItemIndex - 1].pos + updatedList[updatedItemIndex + 1].pos) / 2
  }

  return pos
}
