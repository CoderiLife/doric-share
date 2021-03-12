import { Panel, Group, vlayout, layoutConfig, hlayout, Gravity,Justify, text, Text, Color, navbar, log, flexlayout, Direction, FlexDirection, Align, LayoutSpec, Display } from "doric";

/*
    1. A,B两个控件占满一行，B宽度固定，B紧挨着A显示，当A的内容特别多的时候，B固定在最右侧，A超出的内容显示...
    2. A,B两个控件占满一行，B宽度固定, B显示在最右侧，当A的内容特别多的时候，A超出的内容显示... 
        使用 justifyContent: Justify.SPACE_BETWEEN
*/
@Entry
export class FlexLayoutDemo extends Panel {
    onShow() {
        navbar(context).setTitle("flex-layout")
    }
    build(rootView: Group): void {
        hlayout([
            flexlayout([
                text({
                    text: 'wwwwww',
                    backgroundColor: Color.RED,
                    flexConfig: {
                        flexShrink: 1
                    }
                }),
                text({
                    text: 'Idea',
                    backgroundColor: Color.GREEN,
                    flexConfig: {
                        width: 200,
                        flexShrink: 0
                    }
                })
            ], {
                layoutConfig: layoutConfig().most(),
                
                flexConfig: {
                    flexDirection: FlexDirection.ROW,
                    // justifyContent: Justify.SPACE_BETWEEN
                }
            })
        ])
            .apply({
                backgroundColor: Color.YELLOW,
                layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST).configHeight(LayoutSpec.JUST),
                height: 200,
            })
            .in(rootView)
    }

}