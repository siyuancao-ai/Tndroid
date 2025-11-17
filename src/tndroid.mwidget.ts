function MProgressBar() {
    View.apply(this);

    const horizontalH = 3;
    const smallSize = 30;
    const largeSize = 45;

    const self = this;
    let style = MProgressBar.Horizontal;
    let color = 0xff4688f5;
    const secondaryColor = 0xffb3d3ea;
    let beginDegree = 0;
    let endDegree = Math.PI * 2;
    let offsetDegree = 0;
    let finish = false;
    const density = DisplayMetrics.density;
    let duration = 2000;

    const mProcessor = new Processor();
    mProcessor.startProcess(0, 1, duration);
    mProcessor.setEndListener(function() {
        if (finish == false) {
            offsetDegree += Math.PI;
            mProcessor.startProcess(0, 1, duration);
        }
    });

    this.setWillNotDraw(false);

    this.setCycleDuration = function(d) {
        duration = d;
    };

    this.setStyle = function(s) {
        style = s;
        this.requestLayout();
    };

    this.setProgressColor = function(c) {
        color = c;
    };

    this.setSecondaryProgressColor = function(c) {

    };

    this.stopAnimation = function() {
        finish = true;
        mProcessor.forceFinished(true);
    };

    this.onMeasure = function (wMS) {
        let w, h;
        if (style == MProgressBar.Horizontal) {
            w = MS.getSize(wMS);
            h = horizontalH;
        } else if (style == MProgressBar.Small) {
            w = smallSize;
            h = smallSize;
        } else if (style == MProgressBar.Large) {
            w = largeSize;
            h = largeSize;
        }
        this.setMD(w, h);
    };

    this.onDraw = function(c) {
        if (style == MProgressBar.Horizontal) {
            drawLine(c);
        } else {
            drawCircle(c);
        }
    };

    function drawLine(c) {
        const w = self.getMW() * density;
        const h = self.getMH() * density;
        const distance = w * 1.1;
        const p = mProcessor.getCurrProcess();
        const p1 = f2(p);
        const p2 = f1(p);
        const begin = distance * p1;
        const end = distance * p2;

        c.lineWidth = h;
        c.beginPath();
        c.moveTo(0, h / 2);
        c.lineTo(w, h / 2);
        c.closePath();
        c.strokeStyle = Utils.toCssColor(secondaryColor);
        c.stroke();

        c.beginPath();
        c.moveTo(begin - 0.05 * w, h / 2);
        c.lineTo(end, h / 2);
        c.closePath();
        c.strokeStyle = Utils.toCssColor(color);
        c.stroke();

        calcOffset();
    }

    function drawCircle(c) {
        const x = self.getMW() / 2 * density;
        const y = self.getMH() / 2 * density;
        const lineWidth = x / 5;
        const radius = self.getMW() / 2 * density;
        const distance = Math.PI * 3;
        const p = mProcessor.getCurrProcess();
        const p1 = f1(p);
        const p2 = f2(p);
        beginDegree = offsetDegree + distance * p2;
        endDegree = offsetDegree + Math.PI * 0.1 + distance * p1;
        c.arc(x, y, radius - lineWidth / 2, beginDegree, endDegree);
        c.lineWidth = lineWidth;
        c.strokeStyle = Utils.toCssColor(color);
        c.stroke();

        calcOffset();
    }

    function f1(x) {
        if (x < 0.25) {
            return x * 0.5 + 4 * x * x;
        } else if (x < 0.5) {
            return 0.75 - (0.5 - x) * 0.5 - 4 * (0.5 - x) * (0.5 - x);
        } else {
            return 1 - (1 - x) * 0.5;
        }
    }

    function f2(x) {
        if (x < 0.5) {
            return 0.5 * x;
        } else if (x < 0.75) {
            return 0.25 + (x - 0.5) * 0.5 + 4 * (x - 0.5) * (x - 0.5);
        } else {
            return 1 - (1 - x) * 0.5 - 4 * (1 - x) * (1 - x);
        }
    }

    function calcOffset() {
        if (mProcessor.computeProcessOffset()) {
            self.postInvalidate();
        }
    }
}
Object.defineProperty(MProgressBar,"Horizontal",{value:0});
Object.defineProperty(MProgressBar,"Small",{value:1});
Object.defineProperty(MProgressBar,"Large",{value:2});

function MButton() {
    TextView.apply(this);
    let id;
    let downX;
    let downY;

    const density = DisplayMetrics.density;
    const bg = new WaveDrawable();
    bg.setCallback(this);

    this.setWillNotDraw(false);
    this.setTextSize(16);
    this.setGravity(Gravity.CENTER);

    this.setCornerSize(2, 2, 2, 2);
    this.setBoxShadow(0, 0, 2, 0, 0x33000000);

    this.getId = function() {
        return id;
    };

    this.setId = function(i) {
        id = i;
    };

    this.setDimBg = function(dim) {
        bg.setDimBg(dim);
    };

    this.setWaveColor = function(c) {
        bg.setWaveColor(c);
    };

    this.onTouchEvent = function(e) {
        switch (e.getAction()) {
            case ME.ACTION_DOWN:
                downX = e.getX();
                downY = e.getY();
                break;
            case ME.ACTION_CANCEL:
            case ME.ACTION_UP:
                break;
        }
        return true;
    };

    this.onDraw = function(canvas) {
        if (this.isPressed()) {
            bg.setState(View.VIEW_STATE_PRESSED);
            bg.setX(downX * density);
            bg.setY(downY * density);
        } else {
            bg.setState(View.VIEW_STATE_ENABLED);
        }

        bg.setBounds(0, 0, this.getMW() * density, this.getMH() * density);
        bg.draw(canvas);
    };
}

function MImageButton() {
    ImageButton.apply(this);

    const denisty = DisplayMetrics.density;
    const bg = new WaveDrawable();
    bg.setCallback(this);

    this.setWillNotDraw(false);

    this.setDimBg = function(dim) {
        bg.setDimBg(dim);
    };

    this.setWaveColor = function(c) {
        bg.setWaveColor(c);
    };

    this.onTouchEvent = function(e) {
        switch (e.getAction()) {
            case ME.ACTION_DOWN:
                bg.setState(View.VIEW_STATE_PRESSED);
                bg.setX(e.getX() * denisty);
                bg.setY(e.getY() * denisty);
                break;
            case ME.ACTION_CANCEL:
            case ME.ACTION_UP:
                bg.setState(View.VIEW_STATE_ENABLED);
                break;
        }
    };

    this.onDraw = function(c) {
        bg.setBounds(0, 0, this.getMW() * denisty, this.getMH() * denisty);
        bg.draw(c);
    };
}

const MDialog = new _MDialog();
function _MDialog() {
    LinearLayout.apply(this);

    this.setTag("MDialog");
    this.setBg(0xffffffff);
    this.setCornerSize(2);
    this.setBoxShadow(0, 4, 16, 8, 0x33000000);
    this.setPadding(24);

    const self = this;
    let okAction = null;
    let cancelAction = null;

    const lp = new LP(336, LP.WC);
    lp.gravity = Gravity.CENTER;
    this.setLP(lp);

    const mask = new View();
    mask.setBg(0x66000000);
    mask.setOnClickListener(function() {
        self.hide();
    });
    mask.setClickable(true);

    const title = new TextView();
    title.setTextColor(0xff212121);
    title.setTextSize(24);
    const titleLp = new LP(LP.FP, LP.WC);
    titleLp.bottomMargin = 20;

    const msg = new TextView();
    msg.setTextIsSelectable(true);
    msg.setTextColor(0xff424242);
    msg.setTextSize(14);
    msg.setLineHeight(24);
    msg.setText("this is a dialog");
    const mMsgLp = new LP(LP.FP, LP.WC);
    this.addView(msg, mMsgLp);

    const btnArea = new LinearLayout();
    btnArea.setOrientation(LinearLayout.HORIZONTAL);
    const btnAreaLp = new LP(LP.FP, LP.WC);
    btnAreaLp.setMargins(0, 24, -16, -16);
    this.addView(btnArea, btnAreaLp);

    const paddingView = new View();
    const paddingLp = new LP(0, 36);
    paddingLp.weight = 1;
    btnArea.addView(paddingView, paddingLp);

    const btnLp = new LP(80, 36);

    const cancel = new MButton();
    cancel.setText("cancel");
    cancel.setBoxShadow(0, 0, 0, 0, 0);
    cancel.setDimBg(false);
    cancel.setOnClickListener(function() {
        self.hide();
        if (cancelAction) {
            cancelAction.call(this);
        }
    });
    btnArea.addView(cancel, btnLp);

    const ok = new MButton();
    ok.setBoxShadow(0, 0, 0, 0, 0);
    ok.setText("ok");
    ok.setDimBg(false);
    ok.setOnClickListener(function() {
        self.hide();
        if (okAction) {
            okAction.call(this);
        }
    });
    btnArea.addView(ok, btnLp);

    this.setOkText = function(t) {
        ok.setText(t);
        return this;
    };

    this.setOkColor = function(c) {
        ok.setTextColor(c);
        return this;
    };

    this.setCancelText = function(t) {
        cancel.setText(t);
        return this;
    };

    this.setCancelColor = function(c) {
        cancel.setTextColor(c);
        return this;
    };

    this.setMaskColor = function(c) {
        mask.setBg(c);
        return this;
    };

    this.setTitle = function(t) {
        title.setText(t);
        this.addView(title, 0, titleLp);
        return this;
    };

    this.setMsg = function(msg) {
        msg.setText(msg);
        return this;
    };

    this.setOkAction = function(a) {
        okAction = a;
        return this;
    };

    this.setCancelAction = function(a) {
        cancelAction = a;
        return this;
    };

    this.show = function() {
        const maskLp = new LP(LP.FP, LP.FP);
        mRootView.addView(mask, maskLp);

        mRootView.addView(this);

        mask.setAlpha(0);
        const a = new AlphaAnimation(0, 1);
        a.setDuration(200);
        mask.startAnimation(a);

        this.setAlpha(0);
        const a2 = new AlphaAnimation(0, 1);
        a2.setDuration(200);
        this.startAnimation(a2);
    };

    this.hide = function() {
        const a = new AlphaAnimation(1, 0);
        a.setDuration(200);
        mask.startAnimation(a);

        const a2 = new AlphaAnimation(1, 0);
        a2.setDuration(200);
        a2.setAnimationEndListener(function() {
            mRootView.removeView(mask);
            mRootView.removeView(self);
            self.removeView(title);
            okAction = null;
            cancelAction = null;
        });
        this.startAnimation(a2);
    };
}

function MEditText() {
    ViewGroup.apply(this);

    const labelSize = 12;
    let textSize = 14;
    const padding = 16;
    const errSize = 12;
    const gap = 8;
    const textAreaH = 100;

    const self = this;
    let hint = "";
    let focused;
    let disabled = false;
    let isError = false;
    let isSingleLine = true;
    let focusListener = null;
    let textChangeListener = null;
    let highlightColor = 0xFF2196F2;
    const textColor = 0xff212121;
    let maxCount = 0;

    this.setTag("MEditText");

    const makeEditText = function() {
        editText.setHintText(hint);
        editText.setTextSize(textSize);
        editText.setHintColor(0xffbcbcbc);
    };

    const updateCountView = function() {
        const curCount = editText.getText().length;
        countView.setText(curCount + "/" + maxCount);
        if (maxCount > 0 && curCount > maxCount) {
            self.setError(true);
        } else {
            self.setError(false);
        }
    };

    const updateLine = function() {
        if (disabled) {
            line.setStyle("border-top", "#bcbcbc 1px dashed");
        } else if (isError) {
            line.setStyle("border-top", "#dd3226 2px solid");
        } else if (focused) {
            line.setStyle("border-top", Utils.toCssColor(highlightColor) + " 2px solid");
        } else {
            line.setStyle("border-top", "#bcbcbc 1px solid");
        }
    };

    const updateTextColor = function() {
        if (isError) {
            label.setTextColor(0xffdd3226);
            countView.setTextColor(0xffdd3226);
        } else if (disabled) {
            label.setTextColor(0xffbcbcbc);
            editText.setTextColor(0xffbcbcbc);
            countView.setTextColor(0xffbcbcbc);
        } else if (focused) {
            label.setTextColor(highlightColor);
            countView.setTextColor(0xff757575);
        } else {
            label.setTextColor(0xff757575);
            countView.setTextColor(0xff757575);
            editText.setTextColor(textColor);
        }
    };

    this.isError = function() {
        return isError;
    };

    this.setMaxCount = function(count) {
        if (count > 0) {
            maxCount = count;
            countView.setVisibility(View.VISIBLE);
            updateCountView();
        }
    };

    this.setHighlightColor = function(c) {
        highlightColor = c;
    };

    this.setDisabled = function(d) {
        disabled = d;
        editText.setDisabled(d);
        updateLine();
        updateTextColor();
    };

    this.setText = function(t) {
        editText.setText(t);
        if (t != "") {
            label.setText(hint);
        }
        updateCountView();
    };

    this.setOnFocusChangeListener = function(l) {
        focusListener = l;
    };

    this.setTextChangedListener = function(l) {
        textChangeListener = l;
    };

    this.setPassword = function(isPassword) {
        editText.setPassword(isPassword);
    };

    this.setTextSize = function(ts) {
        textSize = ts;
        editText.setTextSize(ts);
    };

    this.getHint = function() {
        return hint;
    };

    this.setHint = function(t) {
        this.setHintText(t);
    };

    this.setHintText = function(t) {
        hint = t;
        editText.setHintText(t);
    };

    this.setError = function(iserror, msg) {
        if (disabled) {
            return;
        }
        isError = iserror;
        if (isError && msg != undefined) {
            errorMsg.setText(msg);
        } else {
            errorMsg.setText("");
        }
        updateLine();
        updateTextColor();
        this.requestLayout();
    };

    this.setSingleLine = function(s) {
        isSingleLine  = s;
        editText.setSingleLine(s);
        editText.setText("");
        makeEditText();
    };

    const label = new TextView();
    label.setTextSize(12);
    this.addView(label);

    let t = null;

    const editText = new EditText();
    makeEditText();
    editText.setOnFocusChangeListener(function(f) {
        if (focusListener != null) {
            focusListener.call(this, f);
        }
        focused = f;
        if (f) {
            if (editText.getText() == "") {
                editText.setHintText("");
                label.setText(hint);
                t = new TranslateAnimation(0, 0, 8, 0);
                t.setDuration(100);
                t.setAnimationEndListener(function() {
                    updateTextColor();
                    label.setText(hint);
                });
                label.startAnimation(t);
            }
        } else {
            if (editText.getText() == "") {
                t = new TranslateAnimation(0, 0, 0, 8);
                t.setDuration(100);
                t.setAnimationEndListener(function(){
                    editText.setHintText(hint);
                    label.setText("");
                });
                label.startAnimation(t);
            }
        }
        updateLine();
        updateTextColor();
        self.requestLayout();
    });
    editText.setTextChangedListener(function() {
        updateCountView();
        if (textChangeListener != null) {
            textChangeListener.call(self);
        }
    });
    this.addView(editText);

    const errorMsg = new TextView();
    errorMsg.setTextSize(12);
    errorMsg.setTextColor(0xFFDD3226);
    this.addView(errorMsg);

    const countView = new TextView();
    countView.setTextSize(12);
    countView.setVisibility(View.GONE);
    countView.setGravity(Gravity.RIGHT);
    this.addView(countView);

    const line = new View();
    this.addView(line);

    updateLine();
    updateTextColor();

    this.getText = function() {
        return editText.getText();
    };

    this.onMeasure = function(wMS) {
        const w = MS.getSize(wMS);
        const cntW = w;

        measureTextView(label, cntW, labelSize);
        measureTextView(errorMsg, cntW, labelSize);
        measureTextView(countView, cntW, labelSize);

        let h = 0;
        if (isSingleLine) {
            h = padding * 2 + gap * 2 + errSize + labelSize + 2 + textSize + 2;
            Utils.measureExactly(editText, cntW, h);
        } else {
            h = padding * 2 + gap * 2 + errSize + labelSize + 2 + textAreaH + 2;
            Utils.measureExactly(editText, cntW, textAreaH);
        }

        line.measure(cntW, 2);

        this.setMD(w, h);
    };

    this.onLayout = function() {
        const x = 0;
        let y = padding;
        label.layout(x, y - 2);

        y = padding + 10 + gap;
        if (isSingleLine) {
            editText.layout(x, 0);
        } else {
            editText.layout(x, y);
        }
        y = this.getMH() - errSize - gap;
        errorMsg.layout(x, y - 2);
        countView.layout(x, y - 2);

        y = this.getMH() - errSize - gap * 2 - line.getMH();
        line.layout(x, y);
    };

    function measureTextView(v, w, h) {
        v.measure(MS.makeMS(w, MS.EXACTLY), MS.makeMS(h, MS.AT_MOST));
    }
}

function MSelectionButton() {
    LinearLayout.apply(this);

    this.setTag("MSelectionButton");

    let width = 160;
    const height = 48;

    const self = this;
    let isMenuShow = false;
    const mask = new View();
    const menuPanel = new MenuPanel();
    const items = [];
    let selectIndex = 0;

    const selectedItem = new SelectedItem();
    selectedItem.setOnClickListener(function(){
        self.showMenu();
    });
    this.addView(selectedItem);

    const line = new View();
    line.setBg(0xffbcbcbc);
    this.addView(line);

    this.addMenuItem = function(text) {
        items.push(text);
        menuPanel.makeMenu();
        this.setSelect(selectIndex);
    };

    this.setSelect = function(index) {
        selectIndex = index;
        selectedItem.setText(items[index]);
    };

    this.setWidth = function(w) {
        width = w;
    };

    this.showMenu = function() {
        if (isMenuShow) {
            return;
        }

        mask.setOnClickListener(function(){
            self.hideMenu();
        });
        const maskLp = new LP(LP.FP, LP.FP);
        mRootView.addView(mask, maskLp);

        const lp = new LP(width, LP.WC);
        const offset = Utils.getOffset(this.div);
        menuPanel.makeMenu();
        menuPanel.setAlpha(0);
        lp.leftMargin = offset.left;
        lp.topMargin = offset.top - 8;
        mRootView.addView(menuPanel, lp);
        isMenuShow = true;

        const a = new AlphaAnimation(0, 1);
        a.setDuration(100);
        menuPanel.startAnimation(a);
    };

    this.hideMenu = function() {
        const a = new AlphaAnimation(1, 0);
        a.setDuration(100);
        a.setAnimationEndListener(function() {
            mRootView.removeView(mask);
            mRootView.removeView(menuPanel);
            isMenuShow = false;
        });
        menuPanel.startAnimation(a);
    };

    this.onMeasure = function() {
        Utils.measureExactly(selectedItem, width, height);
        line.measure(width, 1);
        this.setMD(width, height);
    };

    this.onLayout = function() {
        const x = 0;
        let y = 0;
        selectedItem.layout(x, y);

        y = this.getMH() - line.getMH();
        line.layout(x, y);
    };

    function SelectedItem() {
        LinearLayout.apply(this);

        this.setWillNotDraw(false);

        const cnt = new LinearLayout();
        cnt.setOrientation(LinearLayout.HORIZONTAL);
        const cntLp = new LP(LP.FP, LP.FP);
        this.addView(cnt, cntLp);

        const textView = new TextView();
        textView.setGravity(Gravity.LEFT | Gravity.CENTER_VERTICAL);
        const textLp = new LP(0, LP.FP);
        textLp.weight = 1;
        cnt.addView(textView, textLp);

        this.setText = function(t) {
            textView.setText(t);
        };

        this.onDraw = function(c) {
            const w = this.getMW() * DisplayMetrics.density;
            const h = this.getMH() * DisplayMetrics.density;
            const s = 6;
            const x = (w - h) + (h / 2) - 10;
            const y = (h - s) / 2;
            c.fillStyle = "#bcbcbc";
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x + s * 2, y);
            c.lineTo(x + s, y + s);
            c.closePath();
            c.fill();
        };
    }

    function MenuPanel() {
        LinearLayout.apply(this);

        this.setBg(0xffffffff);
        this.setBoxShadow(0, 1, 2, 1, 0x33000000);
        this.setPadding(0, 8, 0, 8);

        const buttonView = new LinearLayout();
        buttonView.setOrientation(LinearLayout.VERTICAL);
        const buttonViewLp = new LP(LP.FP, LP.WC);
        this.addView(buttonView, buttonViewLp);

        this.makeMenu = function() {
            buttonView.removeAllViews();
            this.addMenuItem(selectIndex);
            for (let i = 0; i < items.length; i++) {
                if (i != selectIndex) {
                    this.addMenuItem(i);
                }
            }
        };

        this.addMenuItem = function(index) {
            const buttonLp = new LP(LP.FP, 48);
            const button = createButton(items[index]);
            button.setId(index);
            button.setOnClickListener(function () {
                self.setSelect(this.getId());
                self.hideMenu();
            });
            buttonView.addView(button, buttonLp);
        };

        const createButton = function(text) {
            const b = new MButton();
            b.setText(text);
            b.setTextColor(textColor);
            b.setTextSize(textSize);
            b.setBoxShadow(0,0,0,0);
            b.setPadding(padding, 0, 0, 0);
            b.setGravity(Gravity.LEFT | Gravity.CENTER_VERTICAL);
            b.setBg(0x00000000);
            b.setCornerSize(0);
            return b;
        };
    }
}

function WaveDrawable() {
    Drawable.apply(this);

    const self = this;
    const waveDuration = 500;

    const processor = new Processor();

    let curState = View.VIEW_STATE_ENABLED;
    let x = 0;
    let y = 0;
    let dimBg = true;
    let maxRadius = 9999;
    let waveColor = 0x25191919;
    let waving = false;

    this.onStateChange = function(s) {
        if (curState != View.VIEW_STATE_PRESSED && s == View.VIEW_STATE_PRESSED) {
            waving = true;
            processor.startProcess(0, 1, waveDuration);
            processor.setEndListener(function() {
                waving = false;
                onEnd();
            });
        }
        if (s == View.VIEW_STATE_PRESSED) {
            if (curState != s) {
                curState = s;
                this.invalidateSelf();
            }
        }
        if (s == View.VIEW_STATE_ENABLED) {
            waved = false;
            onEnd();
        }

        function onEnd() {
            if (waving == false && s == View.VIEW_STATE_ENABLED) {
                curState = View.VIEW_STATE_ENABLED;
                //self.invalidateSelf();
            }
        }
    };

    this.setX = function(_x) {
        x = _x;
    };

    this.setY = function(_y) {
        y = _y;
    };

    this.setDimBg = function(dim) {
        dimBg = dim;
    };

    this.setWaveColor = function(c) {
        waveColor = c;
    };

    this.setMaxRadius = function(r) {
        maxRadius = r;
    };

    this.draw = function(c) {
        if (curState == View.VIEW_STATE_PRESSED) {
            this.drawPress(c);
        } else if (curState == View.VIEW_STATE_ENABLED) {
            this.drawEnable(c);
        }
        this.computeAnimation();
    };

    this.computeAnimation = function() {
        if (processor.computeProcessOffset()) {
            this.invalidateSelf();
        }
    };

    this.drawPress = function(c) {
        const b = this.getBounds();

        if (dimBg) {
            c.fillStyle = Utils.toCssColor(waveColor);
            c.fillRect(b.left, b.top, b.width(), b.height());
        }

        const offsetX = b.left + x;
        const offsetY = b.top + y;
        const p = processor.getCurrProcess();
        let radius = b.height() / 2 + b.width() * p * 2;
        radius = radius / 2;
        radius = Math.min(radius, maxRadius);
        c.beginPath();
        c.arc(offsetX, offsetY, radius, 0, Math.PI * 2, true);
        c.closePath();
        const alpha = Color.alpha(waveColor);
        const color = Color.argb((1 - p * 0.8) * alpha, Color.red(waveColor), Color.green(waveColor), Color.blue(waveColor));
        c.fillStyle = Utils.toCssColor(color);
        c.fill();
    };

    this.drawEnable = function() {
    };
}

/**
 *
 * This class is used to create a multiple-exclusion scope for a set of radio
 * buttons. Checking one radio button that belongs to a radio group unchecks
 * any previously checked radio button within the same group.
 *
 * Intially, all of the radio buttons are unchecked. While it is not possible
 * to uncheck a particular radio button, the radio group can be cleared to
 * remove the checked state.
 *
 * The selection is identified by the unique id of the radio button as defined
 * in the XML layout file.
 *
 * @class MRadioGroup
 * @extends LinearLayout
 */
function MRadioGroup() {
    LinearLayout.apply(this);

    const self = this;
    let checkedId = -1;
    let onCheckedChangeListener = null;

    this.addChild = function(child, indexOrParams, params) {
        if (child.isChecked()) {
            if (checkedId != -1) {
                setCheckedStateForView(checkedId, false);
            }
            setCheckedId(child.getId());
        }
        child.setCheckedListener(function() {
            self.check(child.getId());
        });
        this.addView(child, indexOrParams, params);
    };

    /**
     * <p>Register a callback to be invoked when the checked radio button
     * changes in this group.</p>
     *
     * @method setOnCheckedChangeListener
     */
    this.setOnCheckedChangeListener = function(l) {
        onCheckedChangeListener = l;
    };

    /**
     * <p>Sets the selection to the radio button whose identifier is passed in
     * parameter. Using -1 as the selection identifier clears the selection;
     *
     * @method
     * @param id the unique id of the radio button to select in this group
     */
    this.check = function(id) {
        // don't even bother
        if (id != -1 && (id == checkedId)) {
            return;
        }
        if (checkedId != -1) {
            setCheckedStateForView(checkedId, false);
        }
        if (id != -1) {
            setCheckedStateForView(id, true);
        }
        setCheckedId(id);
    };

    /**
     * <p>Returns the identifier of the selected radio button in this group.
     * Upon empty selection, the returned value is -1.</p>
     *
     * @method getCheckedRadioButtonId
     * @return the unique id of the selected radio button in this group
     *
     */
    this.getCheckedRadioButtonId = function() {
        return checkedId;
    };

    /**
     * <p>Clears the selection. When the selection is cleared, no radio button
     * in this group is selected and {@link #getCheckedRadioButtonId()} returns
     * null.</p>
     *
     * @method clearCheck
     */
    this.clearCheck = function() {
        this.check(-1);
    };

    function setCheckedId(id) {
        checkedId = id;
        if (onCheckedChangeListener) {
            onCheckedChangeListener.call(this, checkedId);
        }
    }

    function setCheckedStateForView(viewId, checked) {
        const checkedView = self.findViewById(viewId);
        if (checkedView != null) {
            checkedView.setChecked(checked);
        }
    }
}

/**
 *
 * A radio button is a two-states button that can be either checked or
 * unchecked. When the radio button is unchecked, the user can press or click it
 * to check it. However, contrary to a CheckBox, a radio
 * button cannot be unchecked by the user once checked.
 *
 * Radio buttons are normally used together in a
 * RadioGroup. When several radio buttons live inside
 * a radio group, checking one radio button unchecks all the others.
 *
 * @class MRadioButton
 * @extends ViewGroup
 */
function MRadioButton() {
    ViewGroup.apply(this);

    const height = 48;

    const self = this;
    let color = 0xff009688;
    let checked = false;

    let checkedListener = null;

    const radioCheck = new MRadioCheck();
    radioCheck.setOnClickListener(onclick);
    this.addView(radioCheck);

    const text = new TextView();
    text.setTextSize(16);
    text.setTextColor(0xff212121);
    text.setPadding(4);
    text.setGravity(Gravity.LEFT | Gravity.CENTER_VERTICAL);
    this.addView(text);

    this.setOnClickListener(onclick);

    this.setColor = function(c) {
        color = c;
    };

    this.setText = function(t) {
        text.setText(t);
    };

    this.isChecked = function() {
        return checked;
    };

    this.setChecked = function(c) {
        checked = c;
        radioCheck.setChecked(c);
    };

    this.setCheckedListener = function(l) {
        checkedListener = l;
    };

    this.onTouchEvent = function(e) {
        radioCheck.onTouchEvent(e);
        radioCheck.getBgDrawable().setX(48 * DisplayMetrics.density);
    };

    this.onMeasure = function(wMS) {
        const w = MS.getSize(wMS);

        radioCheck.measure(50, 48);
        text.measure(w - 50, MS.makeMS(48, MS.EXACTLY));

        this.setMD(w, height);
    };

    this.onLayout = function() {
        let x = 0;
        const y = 0;
        radioCheck.layout(x, y);

        x += 50;
        text.layout(x, y);
    };

    function onclick() {
        self.setChecked(true);
        if (checkedListener) {
            checkedListener.call(self, checked);
        }
    }

    function MRadioCheck() {
        View.apply(this);

        const density = DisplayMetrics.density;

        const bg = new WaveDrawable();
        bg.setCallback(this);

        this.setWillNotDraw(false);
        this.setCornerSize(24);

        this.getBgDrawable = function() {
            return bg;
        };

        this.setChecked = function() {
            const r = Color.red(color);
            const g = Color.green(color);
            const b = Color.blue(color);
            bg.setWaveColor(Color.argb(25, r, g, b));
            this.postInvalidate();
        };

        this.onTouchEvent = function(e) {
            switch (e.getAction()) {
                case ME.ACTION_DOWN:
                    bg.setState(View.VIEW_STATE_PRESSED);
                    bg.setX(e.getX() * density);
                    bg.setY(e.getY() * density);
                    break;
                case ME.ACTION_CANCEL:
                case ME.ACTION_UP:
                    bg.setState(View.VIEW_STATE_ENABLED);
                    break;
            }
        };

        this.onDraw = function(c) {
            if (checked) {
                c.strokeStyle = Utils.toCssColor(color);
                c.fillStyle = Utils.toCssColor(color);
            } else {
                c.strokeStyle = Utils.toCssColor(0x88000000);
                c.fillStyle = Utils.toCssColor(0x88000000);
            }
            const x = 24 * density;
            const y = 24 * density;
            c.lineWidth = 2 * density;
            c.beginPath();
            c.arc(x, y, 9 * density, 0, Math.PI * 2, false);
            c.closePath();
            c.stroke();

            c.beginPath();
            c.arc(x, y, 5 * density, 0, Math.PI * 2, false);
            c.closePath();
            c.fill();

            bg.setBounds(0, 0, this.getMW() * density, this.getMH() * density);
            bg.draw(c);
        };
    }
}

/**
 *
 * A button with two states, checked and unchecked. When the button is pressed
 * or clicked, the state changes automatically.
 *
 * @class MToggleButton
 * @extends View
 */
function MToggleButton() {
    View.apply(this);

    const density = DisplayMetrics.density;
    const paddingX = 24;
    const trackRadius = 8;
    const self = this;
    let checked;
    let onCheckedChangeListener;
    let downX;
    let color = 0xff009688;
    let thumbColor;
    let trackColor;
    const processor = new Processor();
    let distance;
    let radius;

    const wave = new WaveDrawable();
    wave.setDimBg(false);
    wave.setX(24 * density);
    wave.setY(24 * density);
    wave.setMaxRadius(24 * density);
    wave.setCallback(this);

    this.setClickable(true);
    this.setWillNotDraw(false);
    this.setBg(0x00000000);

    processor.setEndListener(function() {
        if (processor.getCurrProcess() < 0.5) {
            checked = false
        } else {
            checked = true;
        }

        if (onCheckedChangeListener != null) {
            onCheckedChangeListener.call(self, checked);
        }
    });

    function refreshColors() {
        if (processor.getCurrProcess() == 0) {
            thumbColor = 0xfffafafa;
            trackColor = 0x42000000;
            wave.setWaveColor(0x1a000000);
        } else {
            thumbColor = color;
            const r = Color.red(thumbColor);
            const g = Color.green(thumbColor);
            const b = Color.blue(thumbColor);
            trackColor = Color.argb(128, r, g, b);
            wave.setWaveColor(Color.argb(50, r, g, b));
        }
    }

    this.setColor = function(c) {
        color = c;
    };

    /**
     * Register a callback to be invoked when the checked state of this button
     * changes.
     *
     * @method setOnCheckedChangeListener
     * @param l the callback to call on checked state change
     */
    this.setOnCheckedChangeListener = function (l) {
        onCheckedChangeListener = l;
    };

    /**
     * return the checked state of this button.
     *
     * @method isChecked
     * @return {boolean} the checked state of this button.
     */
    this.isChecked = function() {
        return checked;
    };

    function setCurrProcess(p) {
        processor.setCurrProcess(p);
        self.postInvalidate();
    }

    function isClick(e) {
        return (Math.abs(downX - e.getX()) < 5);
    }

    /**
     * Changes the checked state of this button.The default state is true.
     *
     * @method setChecked
     * @param {boolean} c true to check the button, false to uncheck it
     */
    this.setChecked = function (c) {
        checked = c;
        if (c) {
            processor.setCurrProcess(1);
        } else {
            processor.setCurrProcess(0);
        }
        self.postInvalidate();
        refreshColors();
    };

    this.setChecked(false);

    this.onMeasure = function() {
        const trackW = 24 - trackRadius;
        const w = trackW + 48;
        const h = 48;
        this.setMD(w, h);
    };

    this.onDraw = function(c) {
        const w = self.getMW() * density;
        const h = self.getMH() * density;
        const p = processor.getCurrProcess();
        const r = 24 * density;
        let offsetX;
        let offsetY;
        radius = 10 * density;
        distance = w - paddingX * 2 * density;

        refreshColors();

        c.beginPath();
        c.lineWidth = trackRadius * 2 * density;
        c.lineCap = 'round';
        c.moveTo(r, h / 2);
        c.lineTo(w - r, h / 2);
        c.strokeStyle = Utils.toCssColor(trackColor);
        c.stroke();


        offsetX = paddingX * density + distance *  p;
        offsetY = h / 2;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 2;
        c.shadowBlur = 5 * density;
        c.shadowColor = Utils.toCssColor(0x66000000);
        c.beginPath();
        c.arc(offsetX, offsetY, radius, 0, Math.PI * 2, true);
        c.closePath();
        c.fillStyle = Utils.toCssColor(thumbColor);
        c.fill();

        wave.setBounds(offsetX - r, offsetY - r, offsetX + r, offsetY + r);
        wave.draw(c);

        if (processor.computeProcessOffset()) {
            self.postInvalidate();
        }
    };

    this.onTouchEvent = function(e) {
        let p = 0;
        if (checked) {
            p = 1 - (downX - e.getX()) / (distance / density);
        } else {
            p = (e.getX() - downX) / (distance / density);
        }
        p = Math.max(0, p);
        p = Math.min(1, p);
        switch (e.getAction()) {
            case ME.ACTION_DOWN:
                wave.setState(View.VIEW_STATE_PRESSED);
                downX = e.getX();
                break;
            case ME.ACTION_MOVE:

                if (!isClick(e)) {
                    setCurrProcess(p);
                }
                break;
            case ME.ACTION_UP:
            case ME.ACTION_CANCEL:
                wave.setState(View.VIEW_STATE_ENABLED);
                if (isClick(e)) {
                    if (checked) {
                        processor.startProcess(1, 0, 100);
                    } else {
                        processor.startProcess(0, 1, 100);
                    }
                } else {
                    if (p > 0.5) {
                        checked = true;
                        processor.startProcess(p, 1.0, (1 - p) * 100);
                    } else {
                        checked = false;
                        processor.startProcess(p, 0, p * 100);
                    }
                }
                if (processor.computeProcessOffset()) {
                    self.postInvalidate();
                }
                break;
            default:
                break;
        }
    };
}

const MSnackBar = new _MSnackbar();
function _MSnackbar() {
    ViewGroup.apply(this);
    const maxWidth = 568;
    const height = 48;
    const textSize = 14;
    const mSelf = this;
    let showing = false;

    const hide = function() {
        console.log("hide snackbar");
        const t = new TranslateAnimation(0, 0, 0, height);
        t.setDuration(200);
        t.setAnimationEndListener(function() {
            mRootView.removeView(mSelf);
            showing = false;
        });
        mSelf.startAnimation(t);
    };

    this.setTag("SnackBar");
    this.setCornerSize(2);
    this.setBg(0xff323232);

    const cnt = new TextView();
    cnt.setSingleLine(true);
    cnt.setTextSize(textSize);
    cnt.setTextColor(0xffffffff);
    cnt.setPadding(24, 0, 0, 0);
    cnt.setGravity(Gravity.LEFT | Gravity.CENTER_VERTICAL);
    this.addView(cnt);

    this.show = function(text, time) {
        if (showing == true) {
            return;
        }
        console.log("show snackbar");
        showing = true;
        cnt.setText(text);
        const lp = new LP(LP.WC, LP.WC);
        lp.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;
        mRootView.addView(this, lp);
        const t = new TranslateAnimation(0, 0, height, 0);
        t.setDuration(200);
        this.startAnimation(t);

        let duration = 2500;
        if (time != undefined) {
            duration = time;
        }
        this.postDelayed(function() {
            hide();
        }, duration);
    };

    this.onMeasure = function(wMS) {
        let w = MS.getSize(wMS);
        w = Math.min(w, maxWidth);

        cnt.measure(MS.makeMS(w, MS.UNSPECIFIED), MS.makeMS(height, MS.EXACTLY));

        this.setMD(cnt.getMW(), height);
    };

    this.onLayout = function(x, y) {
        cnt.layout(0, 0);
    };
}

