import React, { useRef,useState } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, useWindowDimensions } from "react-native";

const Dragable = ({children,onSwipeProgress=()=>{}, onSwipeRelease=()=>{}, swipeActions={left:"RESET",right:"RESET"}, extra}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const { height, width } = useWindowDimensions();
  const swipeThreshold = (width/5)-5
  const swipeAnimationDuration = 300

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_,{dx}) => (dx < -30) || (dx > 30),
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: 0
        });
      },
      onPanResponderMove: (e, gesture)=>{
        const blockDrag = (gesture.dx>0 && swipeActions.right == "NONE") || (gesture.dx<0 && swipeActions.left == "NONE")
        const maxDragBlocked = Math.abs(gesture.dx)>(width/5)
        var blockedValues={}
        if(blockDrag){
          blockedValues.dx = blockedValues.dy = 0
        }
        if (maxDragBlocked){
          blockedValues.dy = 0
          blockedValues.dx = gesture.dx>0 ? (width/5): -(width/5)
        }
        return Animated.event(
          [
            null,
            { dx: pan.x, dy: pan.y }
          ],{
            useNativeDriver:false,
            listener: () => showProgress(pan.x._value)}
        )(e,blockDrag||maxDragBlocked? blockedValues : gesture)
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const swipeDistance = Math.abs(pan.x._value)
        if(swipeDistance< swipeThreshold){
          console.log("Swipe Canceled")
          return pan.setValue({x:0,y:0})
        }

        handleSwipe(pan.x._value)
      }
    })
  ).current;

  const handleSwipe = xOffSet =>{
    const eventParams = {
      direction:xOffSet<0 ?"left" : (xOffSet>0? "right" : "center"),
      extra:extra
    }

    performSwipeAction(xOffSet<0, swipeActions[xOffSet<0?"left":"right"], eventParams)
  }

  const performSwipeAction = (isLeftSide, actionName,e)=>{
    const actions = {
      "RESET":()=>{Reset();onSwipeRelease(e)},
      "SLIDE":()=>{
        Animated.timing(pan,{
          toValue:{
            x:isLeftSide ? -width : width,
            y:0
          },
          duration:swipeAnimationDuration,
          useNativeDriver:false
        }).start(()=>onSwipeRelease(e))
      },
      "NONE":()=>onSwipeRelease(e)
    }

    actions[actionName]()
  }

  const Reset = ()=>{
    pan.setValue({x:0,y:0})
  }

  const showProgress = xOffSet=>{
    const actionProgress = Math.abs(xOffSet)/80
    onSwipeProgress({
      direction: xOffSet<0 ?"left" : (xOffSet>0? "right" : "center"),
      progress:actionProgress,
      extra:extra
    })
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, ]
      }}
      {...panResponder.panHandlers}
    >
    <View>
      {children}
    </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
    height: 150,
    width: 150,
    borderRadius: 5
  }
});

export default Dragable;