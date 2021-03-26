import { Panel, Group, vlayout, layoutConfig, hlayout, Gravity,Justify, text, Text, Color, navbar, log, flexlayout, Direction, FlexDirection, Align, LayoutSpec, Display, Wrap, CENTER, scroller } from "doric";
import { colors, title } from "./utils";

@Entry
export class FlexLayoutDemo extends Panel {
    onCreate() {
        navbar(context).setTitle("Flex Layout")
    }

    build(rootView: Group): void {
        scroller(
            vlayout(
                [
                    title('Default'),
                    flexlayout(new Array(10).fill(0).map((_, idx) => {
                        return title(`item${idx}`).apply({
                            layoutConfig: layoutConfig().just(),
                            textSize: 18,
                            height: 50,
                            width: 60,
                            backgroundColor: colors[idx]
                        })
                    }), {
                        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
                        height: 50,
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            width: Environment.screenWidth
                        }
                    }),
    
                    title('Wrap'),
                    flexlayout(new Array(10).fill(0).map((_, idx) => {
                        return title(`item${idx}`).apply({
                            layoutConfig: layoutConfig().just(),
                            textSize: 18,
                            height: 50,
                            width: 60,
                            backgroundColor: colors[idx]
                        })
                    }), {
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            flexWrap: Wrap.WRAP,
                            width: Environment.screenWidth
                        }
                    }),
    
                    title('CENTER'),
                    flexlayout(new Array(3).fill(0).map((_, idx) => {
                        return title(`item${idx}`).apply({
                            layoutConfig: layoutConfig().just(),
                            textSize: 18,
                            height: 50,
                            width: 60,
                            backgroundColor: colors[idx]
                        })
                    }), {
                        height: 50,
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            justifyContent: Justify.CENTER,
                            width: Environment.screenWidth
                        }
                    }),
    
                    title('SPACE_BETWEEN'),
                    flexlayout(new Array(3).fill(0).map((_, idx) => {
                        return title(`item${idx}`).apply({
                            layoutConfig: layoutConfig().just(),
                            textSize: 18,
                            height: 50,
                            width: 60,
                            backgroundColor: colors[idx]
                        })
                    }), {
                        height: 50,
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            justifyContent: Justify.SPACE_BETWEEN,
                            width: Environment.screenWidth
                        }
                    }),
    
                    title('SPACE_AROUND'),
                    flexlayout(new Array(3).fill(0).map((_, idx) => {
                        return title(`item${idx}`).apply({
                            layoutConfig: layoutConfig().just(),
                            textSize: 18,
                            height: 50,
                            width: 60,
                            backgroundColor: colors[idx]
                        })
                    }), {
                        height: 50,
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            justifyContent: Justify.SPACE_AROUND,
                            width: Environment.screenWidth
                        }
                    }),
    
                    title('SPACE_EVENLY'),
                    flexlayout(new Array(3).fill(0).map((_, idx) => {
                        return title(`item${idx}`).apply({
                            layoutConfig: layoutConfig().just(),
                            textSize: 18,
                            height: 50,
                            width: 60,
                            backgroundColor: colors[idx]
                        })
                    }), {
                        height: 50,
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            justifyContent: Justify.SPACE_EVENLY,
                            width: Environment.screenWidth
                        }
                    }),

                    title('Flex'),
                    flexlayout(new Array(3).fill(0).map((_, idx) => {
                        return title(`item${idx}`).apply({
                            layoutConfig: layoutConfig().just(),
                            textSize: 18,
                            height: 50,
                            backgroundColor: colors[idx],
                            flexConfig: {
                                flex: idx === 1 ? 2 : 1
                            }
                        })
                    }), {
                        height: 50,
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            width: Environment.screenWidth
                        }
                    }),

                    title('FlexShrink'),
                    flexlayout([
                        title("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111").apply({
                            textSize: 18,
                            height: 50,
                            backgroundColor: colors[0],
                            layoutConfig: layoutConfig().configHeight(LayoutSpec.JUST).configWidth(LayoutSpec.FIT),
                            flexConfig: {
                                flexShrink: 1
                            }
                        }),
                        title("22222").apply({
                            textSize: 18,
                            height: 50,
                            backgroundColor: colors[1],
                            layoutConfig: layoutConfig().configHeight(LayoutSpec.JUST).configWidth(LayoutSpec.FIT),
                            flexConfig: {
                                flexShrink: 0,
                                width: 100,
                            }
                        })
                    ], {
                        flexConfig: {
                            flexDirection: FlexDirection.ROW,
                            width: Environment.screenWidth
                        }
                    }),

                    title('').apply({
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST).configHeight(LayoutSpec.JUST),
                        backgroundColor: Color.WHITE,
                        height: 100
                    })
                ],
                {
                    space: 10,
                    layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST).configHeight(LayoutSpec.FIT)
                }
            ), {
                layoutConfig: layoutConfig().most()
            }
        ).in(rootView)
    }

}