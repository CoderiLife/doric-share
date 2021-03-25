import { Panel, Group, scroller, vlayout, image, layoutConfig, LayoutSpec, Input, Gravity, log, stack, hlayout, text, CENTER, slider, slideItem, modal, Slider, Text, Color, View, Stack, animate, flowlayout, FlowLayoutItem, NestedSlider, ScaleType, navbar } from "doric";
import { title, colors } from "./utils";

@Entry
export class TabDemo extends Panel {
    private tabs!: Text[]
    private indicator!: View
    private sliderView!: NestedSlider
    build(root: Group) {
        scroller(
            vlayout([
                stack([
                    hlayout([
                        ...this.tabs = [0, 1, 2].map(idx => {
                            return text({
                                text: `Tab  ${idx}`,
                                layoutConfig: layoutConfig().just().configWeight(1),
                                height: 40,
                                onClick: () => {
                                    this.sliderView.slidePage(context, idx, true)
                                },
                            })
                        })
                    ]).apply({
                        layoutConfig: layoutConfig().most(),
                        gravity: Gravity.Center,
                    }),
                    stack([], {
                        backgroundColor: colors[0],
                        width: 20,
                        height: 2,
                        layoutConfig: layoutConfig().configAlignment(Gravity.Bottom).configMargin({bottom: 13})
                    }).also(it => this.indicator = it)
                ]).apply({
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
                    height: 64,
                }),

                (new NestedSlider).also(v => {
                    this.sliderView = v;
                    v.onPageSlided = (idx) => {
                        this.refreshTabs(idx)
                    }
                    [0, 1, 2].map(idx => {
                        if (idx === 0) {
                            return flowlayout({
                                layoutConfig: layoutConfig().most(),
                                itemCount: 100,
                                columnCount: 2,
                                columnSpace: 10,
                                rowSpace: 10,
                                renderItem: (itemIdx) => {
                                    return new FlowLayoutItem().apply({
                                        backgroundColor: colors[itemIdx % colors.length],
                                        height: (Math.random() + 1) * 50,
                                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                                    })
                                },
                            })
                        } else {
                            return text({
                                backgroundColor: idx === 1 ? Color.RED : Color.BLUE, 
                                layoutConfig:layoutConfig().most()
                            })
                        }
                    }).forEach(e => {
                        v.addSlideItem(e)
                    })
                }).apply({
                    layoutConfig: layoutConfig().most().configWeight(1)
                }),
            ]).also(it => {
                it.layoutConfig = layoutConfig().most()
            })
        ).apply({
            layoutConfig: layoutConfig().most()
        }).in(root)

        this.indicator.centerX = this.getRootView().width / this.tabs.length * 0.5
        this.refreshTabs(0)
    }

    refreshTabs(page: number) {
        this.tabs.forEach((e, idx) => {
            if (idx === page) {
                e.textColor = colors[0]
            } else {
                e.textColor = Color.BLACK
            }
        })

        animate(context)({
            animations: () => {
                this.indicator.centerX = this.getRootView().width / this.tabs.length * (page + 0.5)
            },
            duration: 250,
        })
    }

    onCreate() {
        navbar(context).setTitle('Tab Demo')
    }
}