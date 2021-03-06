import { formatValue, validInputValue, unformatValue, truncateByDecimals } from './Input.util'

describe('components/BigNumberInput/util', () => {
  describe('formatValue', () => {
    it('formats string numbers with thousend and decimal separator', () => {
      expect(formatValue('1234567.89', 8)).toEqual('1,234,567.89')
    })
    it('formats string numbers by given decimal', () => {
      expect(formatValue('1.2345678', 2)).toEqual('1.23')
    })
    it('formats empty string to "0"', () => {
      expect(formatValue('')).toEqual('0')
    })
    it('formats "." to 0.', () => {
      expect(formatValue('.')).toEqual('0.')
    })
    it('keeps format for "0." (no change)', () => {
      expect(formatValue('0.')).toEqual('0.')
    })
    it('formats "." to "0" for non (zero) decimal values', () => {
      expect(formatValue('.', 0)).toEqual('0')
    })
    it('formats zeros to "0"', () => {
      expect(formatValue('0000')).toEqual('0')
    })
    it('formats decimal zeros to "0"', () => {
      expect(formatValue('0.000')).toEqual('0')
    })
    it('ignores non numbers in string', () => {
      expect(formatValue('a9ü&9%"+Ä')).toEqual('99')
    })
    it('formats string of non numbers to 0', () => {
      expect(formatValue('hello')).toEqual('0')
    })
    it('trims zeros', () => {
      expect(formatValue('00001.01000')).toEqual('1.01')
    })
  })

  describe('validInputValue', () => {
    it('returns true for strings of numbers ', () => {
      expect(validInputValue('123')).toBeTruthy()
    })
    it('returns true for strings of decimal numbers ', () => {
      expect(validInputValue('123.45')).toBeTruthy()
    })
    it('returns true for "0."', () => {
      expect(validInputValue('0.')).toBeTruthy()
    })
    it('returns false for non numbers ', () => {
      expect(validInputValue('hello')).toBeFalsy()
    })

    it('returns false for numbers including invalid characters ', () => {
      expect(validInputValue('9hello')).toBeFalsy()
    })
  })

  describe('unformatValue', () => {
    it('should not change correct string', () => {
      expect(unformatValue('123123')).toEqual('123123')
      expect(unformatValue('123.123')).toEqual('123.123')
      expect(unformatValue('0.123')).toEqual('0.123')
    })
    it('should remove `.` at the end of string', () => {
      expect(unformatValue('123.')).toEqual('123')
      expect(unformatValue('.')).toEqual('')
    })
    it('should remove all `,` from a string', () => {
      expect(unformatValue(',123,')).toEqual('123')
      expect(unformatValue('123,123,123,123,123')).toEqual('123123123123123')
    })
    it('should unformat formatted value correctly', () => {
      expect(unformatValue('123,123,123,123,123.')).toEqual('123123123123123')
      expect(unformatValue('123,123,123,123,123.123123')).toEqual('123123123123123.123123')
    })
  })

  describe('truncateByDecimals', () => {
    it('should not change value if there is no decimals', () => {
      expect(truncateByDecimals(8)('123123')).toEqual('123123')
    })
    it('should not change value if decimal part less then decimals', () => {
      expect(truncateByDecimals(8)('123123.123123')).toEqual('123123.123123')
      expect(truncateByDecimals(8)('123123')).toEqual('123123')
    })

    it('should not truncate `.` symbol at the end of string', () => {
      expect(truncateByDecimals(8)('123123.')).toEqual('123123.')
    })

    it('should truncate by decimals', () => {
      expect(truncateByDecimals(0)('123123.123')).toEqual('123123')
      expect(truncateByDecimals(2)('123123.123')).toEqual('123123.12')
      expect(truncateByDecimals(8)('123123.12345678999')).toEqual('123123.12345678')
    })
  })
})
