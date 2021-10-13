export const humanFriendlyTime = seconds => {
  var years = Math.floor(seconds/31536000)
  var days = Math.floor((seconds/86400) % 365)
  var hours = Math.floor((seconds / 3600) % 24);
  var minutes = Math.floor((seconds / 60) % 60);
  var sec = seconds % 60;
  const times = [
    {unit:"year", amount:years},
    {unit:"day", amount:days},
    {unit:"hour", amount:hours},
    {unit:"minutes", amount:minutes},
    {unit:"second", amount:sec}
  ]
  const {amount,unit} = times.filter(t=>t.amount!=0)[0]
  return amount + ` ${unit}${amount>1?"s":""}` 
}