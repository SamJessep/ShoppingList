import React, { useRef,useState } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, useWindowDimensions } from "react-native";

const Dragable = ({children,onSwipeProgress=()=>{}, onSwipeRelease=()=>{}, swipeRemove={left:true,right:false}, extra}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [color,setColor] = useState("blue")
  const { height, width } = useWindowDimensions();
  const swipeThreshold = 80
  const swipeAnimationDuration = 300

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_,{dx}) => (dx < -30) || (dx > 30),
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],{
          useNativeDriver:false,
          listener: () => showProgress(pan.x._value)}
      ),
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
    if(xOffSet>0){
      if(swipeRemove.right) return onSwipeRelease(eventParams)
      Animated.timing(pan,{
        toValue:{
          x:width,
          y:0
        },
        duration:swipeAnimationDuration,
        useNativeDriver:false
      }).start(()=>onSwipeRelease(eventParams))
    }else{
      if(swipeRemove.left) return onSwipeRelease(eventParams)
      Animated.timing(pan,{
        toValue:{
          x:-width,
          y:0
        },
        duration:swipeAnimationDuration,
        useNativeDriver:false
      }).start()
    } 
  }

  const Reset = ()=>{
    pan.setValue({x:0,y:0})
  }

  const showProgress = xOffSet=>{
    setColor("blue")
    const actionProgress = Math.abs(xOffSet)/80
    if(xOffSet>0){
      //Right
      if(Math.abs(xOffSet)>swipeThreshold) setColor("green")
    }else{
      //Left
      if(Math.abs(xOffSet)>swipeThreshold) setColor("red")
    }

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
    <View style={{backgroundColor:color}}>
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