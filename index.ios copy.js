/**
 * Sample Calc App
 * https://github.com/facebook/react-native
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

const CALC_TEXT_AC = 'AC',
  CALC_TEXT_BOOL = '+/-',
  CALC_TEXT_PERCENT = '%',
  CALC_TEXT_DIVIDE = '/',
  CALC_TEXT_7 = '7',
  CALC_TEXT_8 = '8',
  CALC_TEXT_9 = '9',
  CALC_TEXT_MULTIPLY = 'x',
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

var BOARD_PADDING = 3;
var CELL_MARGIN = 4;
var CELL_SIZE = 85;

class ResultView extends Component {
  render() {
    return (
      <Text style={styles.result}>{this.props.result}</Text>
    );
  }
}

class Cell extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var style = [styles.cell];
    if (this.props.text === CALC_TEXT_0) {
      style = [styles.cell_2x];
    }

    return (
      <TouchableHighlight style={style} underlayColor='#99d9f4'
            onPress={this.props.onCellPressed.bind(this.props.calc, this.props.text)}>
            <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

class BLayout extends Component {
  render() {
    var rows = this.props.board.grid.map((cells, row) =>
      <View style={styles.row}>
        {cells.map((v, col) =>
          <Cell onCellPressed={this.props.onCellPressed} calc={this.props.calc} text={v}/>
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
  operPre: string;
  curr: string;
  operator: string;
  temp: string;
  isNextOperInit: boolean;
  grid: Array < Array < string >> ;

  constructor() {
    this.operPre = '';
    this.curr = '';
    this.operator = '';
    this.temp = '';
    this.isNextOperInit = true;

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
    console.log(this.operPre + ' ' + this.operator + ' ' + this.curr);
    var s = this.operator;
    var result = 0;
    if (s === CALC_TEXT_DIVIDE) {
      result = parseFloat(this.operPre) / parseFloat(this.curr);
    } else if (s === CALC_TEXT_MULTIPLY) {
      result = parseFloat(this.operPre) * parseFloat(this.curr);
    } else if (s === CALC_TEXT_MINUS) {
      result = parseFloat(this.operPre) - parseFloat(this.curr);
    } else if (s === CALC_TEXT_PLUS) {
      result = parseFloat(this.operPre) + parseFloat(this.curr);
    }
    return result;
  }

  clear() {
    this.operPre = '';
    this.curr = '';
    this.operator = '';
  }

  verify(): string {
    if (this.curr === '') {
      return '';
    }
    var c = this.curr + '';
    if (c.lastIndexOf('.') == c.length - 1) { //最后一位是小数点
      c = c.substring(0, c.length - 1);
    }
    return c;
  }

  press(s): string {
    if (s === CALC_TEXT_AC) {
      this.clear();
      return '0';
    } else if (s === CALC_TEXT_BOOL) { //取反
      if (this.curr === '') {
        return 0;
      }

      var c = this.verify();
      this.clear();
      this.curr = -parseFloat(c);
      return this.curr;
    } else if (s === CALC_TEXT_PERCENT) {
      if (this.curr === '' || this.curr == 0) {
        return 0;
      }
      var c = this.verify();
      this.clear();
      this.curr = parseFloat(c) / 100;
      return this.curr;
    } else if (s === CALC_TEXT_DIVIDE || s === CALC_TEXT_MULTIPLY || s === CALC_TEXT_MINUS || s === CALC_TEXT_PLUS) {
      var vValue = null;
      if (this.operPre != '' && this.curr != '' && this.operator != '') { //先计算并赋给 this.operPre
        if (!this.isNextOperInit) {
          vValue = this.result();
          this.clear();
          this.operPre = vValue;
        } else {
          //this.operPre = this.curr;
          this.curr = '';
        }

      } else {
        if (this.curr === '') {

        } else {
          this.operPre = this.curr;
        }

        this.curr = '';

        this.isNextOperInit = false;
      }

      this.operator = s;

      return vValue;
    } else if (s === CALC_TEXT_EQUALS) {
      var result = this.result();
      this.isNextOperInit = true;
      this.operPre = result;
      return result;
    } else { //数字、小数点
      this.curr += s;
      return this.curr;
    }

  }
}

class Calc extends Component {
  getInitialState() {
    return {
      board: new Board(),
      result: 0
    };
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  onCellPressed(text) {
    var result = this.state.board.press(text);
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
    borderRadius: 5,
    backgroundColor: '#ddccbb',
    margin: CELL_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell_2x: {
    width: CELL_SIZE * 2 + BOARD_PADDING * 2,
    height: CELL_SIZE,
    borderRadius: 5,
    backgroundColor: '#ddccbb',
    margin: CELL_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    padding: BOARD_PADDING,
    backgroundColor: '#bbaaaa',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  result: {
    fontSize: 50,
    marginTop: 40,
    marginRight: 0,
    textAlign: 'right',
    backgroundColor: '#eecc77',
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('Calc', () => Calc);