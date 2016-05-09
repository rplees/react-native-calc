/**
 * Calc App
 * https://github.com/rplees/react-native-calc
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
}
from 'react-native';
var PixelRatio = require('PixelRatio');
var Dimensions = require('Dimensions');

const CALC_TEXT_AC = 'AC',
  CALC_TEXT_BOOL = '+/-',
  CALC_TEXT_PERCENT = '%',
  CALC_TEXT_DIVIDE = '/',
  CALC_TEXT_7 = '7',
  CALC_TEXT_8 = '8',
  CALC_TEXT_9 = '9',
  CALC_TEXT_MULTIPLY = '*',
  CALC_TEXT_4 = '4',
  CALC_TEXT_5 = '5',
  CALC_TEXT_6 = '6',
  CALC_TEXT_MINUS = '-',
  CALC_TEXT_1 = '1',
  CALC_TEXT_2 = '2',
  CALC_TEXT_3 = '3',
  CALC_TEXT_PLUS = '+',
  CALC_TEXT_0 = '0',
  CALC_TEXT_POINT = '.',
  CALC_TEXT_EQUALS = '=';

var _width = Dimensions.get('window').width;

const BOARD_PADDING = 3;
const CELL_MARGIN = 4;
const CELL_SIZE = (_width - (5 * CELL_MARGIN) - (2 * 2 * BOARD_PADDING)) / 4;

console.log('CELL_SIZE:' + CELL_SIZE);
class ResultView extends Component {
  render() {
    var style = [styles.result];
    var len = (this.props.result + '').length;
    style.push(len <= 12 ? styles.font_50 : styles.font_25);

    return (
      <View style={styles.result_container}><Text style={style}>{this.props.result}</Text></View>
    );
  }
}

class Cell extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var style = [styles.cell];
    var style_text = [styles.buttonText];
    if (this.props.text === CALC_TEXT_0) {
      style = [styles.cell_2x];
    }

    if (this.props.text === CALC_TEXT_MULTIPLY || this.props.text === CALC_TEXT_DIVIDE || this.props.text === CALC_TEXT_MINUS || this.props.text === CALC_TEXT_PLUS || this.props.text === CALC_TEXT_EQUALS) {
      style.push(styles.background_color_2);
      style_text.push(styles.color_white);
    } else {
      style.push(styles.background_color_1);
      style_text.push(styles.color_black);
    }

    return (
      <TouchableHighlight style={style} underlayColor='#99d9f4'
            onPress={this.props.onCellPressed.bind(this.props.calc, this.props.text)}>
            <Text style={style_text}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

class BLayout extends Component {
  render() {
    var rows = this.props.board.grid.map((cells, row) =>
      <View style={styles.row} key={'row' + row}>
        {cells.map((v, col) =>
          <Cell onCellPressed={this.props.onCellPressed} key={v} calc={this.props.calc} text={v}/>
        )}
      </View>
    );

    return (
      <View style={styles.board}>
        {rows}
      </View>
    );
  }
}

class Board {
  tempPressKey: string;
  curr: string;
  expression: string;
  pressNumberJustCleanCurr: boolean;
  grid: Array < Array < string >> ;

  constructor() {
    this.tempPressKey = '';
    this.expression = '';
    this.curr = '';
    this.pressNumberJustCleanCurr = false;

    var size = 4;
    var grid = Array(size);

    grid[0] = [CALC_TEXT_AC, CALC_TEXT_BOOL, CALC_TEXT_PERCENT, CALC_TEXT_DIVIDE];
    grid[1] = [CALC_TEXT_7, CALC_TEXT_8, CALC_TEXT_9, CALC_TEXT_MULTIPLY];
    grid[2] = [CALC_TEXT_4, CALC_TEXT_5, CALC_TEXT_6, CALC_TEXT_MINUS];
    grid[3] = [CALC_TEXT_1, CALC_TEXT_2, CALC_TEXT_3, CALC_TEXT_PLUS];
    grid[4] = [CALC_TEXT_0, CALC_TEXT_POINT, CALC_TEXT_EQUALS];

    this.grid = grid;
  }

  result(): string {
    console.log(this.expression);

    this.pressNumberReset = true;
    try {
      var result = eval(this.expression);
      return result;
    } catch (e) {
      return 'Error:' + e.message;
    }
  }

  clear() {
    this.curr = '';
    this.expression = '';
  }

  verify(): string {
    if (this.curr === '') {
      return this.curr;
    }
    var c = this.curr + '';
    if (c.lastIndexOf('.') == c.length - 1) { //最后一位是小数点
      c = c.substring(0, c.length - 1);
    }
    return c;
  }

  isOperFlagEnd(s): boolean { /**表达式是否是以操作符结尾 true-操作符结尾*/
    return this.expression.endsWith(CALC_TEXT_MULTIPLY) || this.expression.endsWith(CALC_TEXT_DIVIDE) || this.expression.endsWith(CALC_TEXT_MINUS) || this.expression.endsWith(CALC_TEXT_PLUS);
  }

  d(): string {
    var s = this.result();
    this.clear();
    this.curr = s + '';
    this.pressNumberJustCleanCurr = true;
    return s;
  }

  onPress(s): string {
    var r = this._press(s);
    this.tempPressKey = s;
    return r;
  }

  _press(s): string {
    if (s === CALC_TEXT_AC) {
      this.clear();
      return '0';
    } else if (s === CALC_TEXT_BOOL || s === CALC_TEXT_PERCENT) {
      var c = this.verify();
      if (c == '') {
        return '0';
      }
      if (c.startsWith('-')) {
        c = '(' + c + ')';
      }

      if (s === CALC_TEXT_BOOL) { //取反
        this.expression = '(-' + c + ')';
      } else {
        this.expression = '(' + c + '/100)';
      }

      return this.d();
    } else if (s === CALC_TEXT_DIVIDE || s === CALC_TEXT_MULTIPLY || s === CALC_TEXT_MINUS || s === CALC_TEXT_PLUS) {
      if (this.tempPressKey === s) { //连续按了俩下
        console.log('至少连续按了俩下相同的键.');
      } else {
        this.expression += (this.curr + s);
        this.pressNumberJustCleanCurr = true;
      }
    } else if (s === CALC_TEXT_EQUALS) {
      if (this.expression == '') {
        console.log('表达式为空.');
        return null;
      } else if (this.isOperFlagEnd(this.expression)) {
        this.expression += this.curr;
      }

      return this.d();
    } else { //数字、小数点
      if (this.pressNumberJustCleanCurr) {
        console.log('pressNumberJustCleanCurr:true');
        this.curr = '';
        this.pressNumberJustCleanCurr = false;
      }

      this.curr += s;

      /*while (this.curr.startsWith('0')) { //去掉首尾是0的
        this.curr = this.curr.substring(1);
      }*/
      return this.curr == '' ? 0 : this.curr;
    }

  }
}

class Calc extends Component {
  /*getInitialState() {
    return {
      board: new Board(),
      result: 0
    };
  }*/

  constructor(props) {
    super(props);
    this.state = {
      board: new Board(),
      result: 0
    }
  }

  onCellPressed(text) {
    var result = this.state.board.onPress(text);
    if (result != null) {
      this.setState({
        result: result
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ResultView result={this.state.result}/>
        <BLayout board={this.state.board} onCellPressed={this.onCellPressed} calc={this}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    flex: 1,
    borderRadius: 5,
    margin: CELL_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell_2x: {
    flex: 2,
    width: CELL_SIZE * 2 + BOARD_PADDING * 2,
    height: CELL_SIZE,
    borderRadius: 5,
    margin: CELL_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    padding: BOARD_PADDING,
    backgroundColor: '#bdd6f6',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  background_color_1: {
    backgroundColor: '#e0e0e0',
  },
  background_color_2: {
    backgroundColor: '#f6aa91',
  },

  color_white: {
    color: 'white',
  },
  color_black: {
    color: 'black',
  },
  buttonText: {
    fontSize: 30,
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#deecf6',
  },
  result_container: {
    backgroundColor: '#deecf6',
    marginTop: 40,
    height: 80,
    justifyContent: 'center',
    borderRadius: 5,
  },
  font_50: {
    fontSize: 50,
  },
  font_25: {
    fontSize: 25,
  },
  result: {
    marginRight: 0,
    textAlign: 'right',
  }
});

AppRegistry.registerComponent('Calc', () => Calc);