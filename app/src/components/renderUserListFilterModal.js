import MyXYControlledModal from "./userListFilterModal"

const RenderMyXYControlledModal = () => {
  return <MyXYControlledModal 
            onHide={e => e.stopPropagation()}
         />
}

export default RenderMyXYControlledModal