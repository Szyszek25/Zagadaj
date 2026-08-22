import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const C = {
  bg: '#FBFAF8', ink: '#0E1314', muted: '#737A80', teal: '#00A89E',
  tealSoft: '#E5F9F6', soft: '#F4F6F5', line: '#E5E8E8', white: '#FFFFFF', dark: '#080909'
};
const tabs = [
  ['today','Dziś','●'], ['reels','Rolki','▶'], ['coach','Coach','···'], ['progress','Postęp','▥']
];

function BottomNav({active,onChange,dark=false}){
  return <View style={[s.nav,dark&&s.navDark]}>{tabs.map(([key,label,glyph])=>{
    const on=key===active; const color=on?C.teal:(dark?'#A6ADB0':C.muted);
    return <Pressable key={key} onPress={()=>onChange(key)} style={s.navItem}>
      <Text style={[s.navGlyph,{color}]}>{glyph}</Text><Text style={[s.navLabel,{color}]}>{label}</Text>
      <View style={[s.navLine,on&&{backgroundColor:C.teal}]}/>
    </Pressable>
  })}</View>
}
function Stat({value,label,dark=false}){return <View style={s.stat}><Text style={[s.statValue,dark&&{color:C.white}]}>{value}</Text><Text style={[s.statLabel,dark&&{color:'#BCC2C4'}]}>{label}</Text></View>}

function Today({xp,setXp}){
  const [started,setStarted]=useState(false);
  const start=()=>{if(!started)setXp(v=>v+20);setStarted(true)};
  return <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    <View style={s.header}><Text style={s.brand}>Zagadaj<Text style={{color:C.teal}}> •</Text></Text><View style={s.stats}><Stat value="7 dni" label="seria"/><Stat value={xp} label="punkty"/></View></View>
    <View style={s.tabsRow}><Text style={[s.tab,C.teal&&{color:C.teal}]}>Dziś</Text><Text style={s.tabMuted}>Na uczelni</Text><Text style={s.tabMuted}>W mieście</Text></View>
    <View style={s.activeUnderline}/>
    <Text style={s.eyebrow}>DZIŚ</Text><Text style={s.hero}>Dzisiejsze{`\n`}wyzwanie</Text>
    <Text style={s.challenge}>Zagadaj dziś do 1 osoby,{`\n`}z którą złapiesz <Text style={{color:C.teal,fontWeight:'700'}}>naturalny vibe.</Text></Text>
    <View style={s.quoteBox}><Text style={s.quoteMark}>“</Text><Text style={s.quote}>Hej, totalnie znikąd,{`\n`}ale masz bardzo dobrą energię.</Text></View>
    <Text style={s.support}>Nie chodzi o ideał. Wystarczy zacząć.</Text>
    <Pressable style={[s.cta,started&&{opacity:.65}]} onPress={start}><Text style={s.ctaText}>{started?'Wyzwanie rozpoczęte ✓':'Zaczynam'}</Text></Pressable>
    <Text style={s.section}>Spróbuj też</Text><View style={s.rowBetween}><Text style={s.link}>Prostsza wersja →</Text><Text style={s.link}>Na uczelni →</Text></View>
    <View style={s.divider}/><Text style={s.micro}>Mały krok &gt; perfekcyjny opener.</Text>
  </ScrollView>
}

const REELS=[
  {id:'1',place:'WARSZAWA • KAWIARNIA',title:'Jak zagadać\nw kolejce po kawę',copy:'„Hej, stoisz tu często czy dziś wyjątkowo?”',who:'@ania.zagaduje  •  600 m',time:'0:23',likes:'1,2K',comments:'86'},
  {id:'2',place:'KAMPUS • UCZELNIA',title:'3 pierwsze zdania\nna uczelni',copy:'„Hej, wiesz może gdzie jest ta sala? Dopiero ogarniam ten budynek.”',who:'@mateusz.startuje  •  1,1 km',time:'0:18',likes:'842',comments:'41'},
  {id:'3',place:'MIASTO • SPACER',title:'Bez cringu:\nkomplement, który działa',copy:'„Masz super kurtkę — serio pasuje do Ciebie.”',who:'@ola.zagaduje  •  Warszawa',time:'0:26',likes:'2,4K',comments:'103'},
];
function Reel({item,h}){return <View style={[s.reel,{height:h}]}>
  <View style={s.fakeScene}><View style={[s.person,{left:38,backgroundColor:'#29423E'}]}/><View style={[s.person,{right:38,backgroundColor:'#514A3D'}]}/><View style={s.counter}/></View>
  <View style={s.reelTop}><Text style={s.reelTitleTop}>Rolki</Text><Text style={s.reelSub}>prawdziwe zagadania</Text><View style={s.reelFilters}><Text style={s.filterOn}>Na żywo</Text><Text style={s.filterOff}>Na uczelni</Text><Text style={s.filterOff}>Kawiarnia</Text></View></View>
  <View style={s.play}><Text style={s.playText}>▶</Text></View>
  <View style={s.rail}><Text style={s.railIcon}>♥</Text><Text style={s.railCount}>{item.likes}</Text><Text style={s.railIcon}>···</Text><Text style={s.railCount}>{item.comments}</Text><Text style={s.railIcon}>▱</Text></View>
  <View style={s.reelBottom}><Text style={s.place}>{item.place}</Text><Text style={s.reelHeadline}>{item.title}</Text><Text style={s.duration}>{item.time}</Text><Text style={s.reelCopy}>{item.copy}</Text><Text style={s.reelWho}>{item.who}</Text><Text style={s.swipe}>Przesuń w górę po następny</Text></View>
</View>}
function Reels(){const h=Dimensions.get('window').height-62;return <FlatList data={REELS} keyExtractor={i=>i.id} renderItem={({item})=><Reel item={item} h={h}/>} pagingEnabled showsVerticalScrollIndicator={false}/>}

function Coach(){
 const [value,setValue]=useState(''); const [extra,setExtra]=useState([]);
 const send=()=>{if(!value.trim())return;setExtra(v=>[...v,value.trim()]);setValue('')};
 return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={s.coachPage} keyboardShouldPersistTaps="handled">
   <View style={s.header}><Text style={s.coachTitle}>Coach</Text><Text style={s.live}>●  Na żywo</Text></View>
   <View style={s.scenario}><Text style={s.scenarioBold}>Sytuacja:</Text><Text style={s.scenarioText}> ona stoi sama w kolejce po kawę</Text></View>
   <View style={[s.bubble,s.userBubble]}><Text style={s.bubbleText}>Chcę zagadać, ale mam{`\n`}pustkę w głowie</Text></View>
   <View style={s.coachRow}><View style={s.avatar}><Text style={{color:C.teal}}>•ᴗ•</Text></View><View style={[s.bubble,s.coachBubble]}><Text style={s.bubbleText}>Spokojnie. Zacznij prosto i lekko.</Text></View></View>
   <View style={[s.bubble,s.suggestion]}><Text style={s.spark}>✦</Text><Text style={s.suggestionText}>Hej, wyglądasz jak ktoś,{`\n`}kto wie, co tu najlepiej smakuje.</Text></View>
   <View style={[s.bubble,s.suggestionSmall]}><Text style={s.spark}>✦</Text><Text style={s.suggestionText}>Hej, mogę o coś zapytać?</Text></View>
   {extra.map((m,i)=><View key={i} style={[s.bubble,s.userBubble,{marginTop:10}]}><Text style={s.bubbleText}>{m}</Text></View>)}
   <View style={s.quickRow}>{['Prostsza wersja','Na uczelni','Po rozmowie'].map(x=><View key={x} style={s.quick}><Text style={s.quickText}>{x}</Text></View>)}</View>
   <View style={s.inputWrap}><TextInput value={value} onChangeText={setValue} placeholder="Opisz sytuację…" placeholderTextColor={C.muted} style={s.input}/><Pressable onPress={send} style={s.send}><Text style={s.sendText}>↑</Text></Pressable></View>
 </ScrollView></KeyboardAvoidingView>
}

function Progress({xp}){const days=['Pon','Wt','Śr','Czw','Pt','Sb','Ndz'];return <ScrollView contentContainerStyle={s.progressPage}>
 <View style={s.header}><Text style={s.coachTitle}>Postęp</Text><View style={s.stats}><Stat value="7 dni" label="seria"/><Stat value={xp} label="punkty"/></View></View>
 <Text style={s.progressTitle}>Twój tydzień</Text><Text style={s.progressSub}>4 dni z rzędu. Jest rytm.</Text>
 <View style={s.days}>{days.map((d,i)=><View key={d} style={s.day}><Text style={s.dayLabel}>{d}</Text><View style={[s.dayDot,i<4?s.dayDone:s.dayOff]}><Text style={i<4?s.dayCheck:s.dayNum}>{i<4?'✓':i+1}</Text></View></View>)}</View>
 <View style={s.divider}/><Text style={s.bigMetric}>3 zagadania</Text><Text style={s.metricSub}>w tym tygodniu</Text><Text style={s.progressSub}>Najlepiej idzie Ci na uczelni i w kawiarni.</Text>
 <Text style={s.progressSection}>Odblokowane startery</Text>{[['Naturalny komplement','+20 XP'],['Pytanie o kontekst','+15 XP'],['Lekki follow-up','✓']].map(([a,b],i)=><View key={a} style={s.progressRow}><Text style={s.progressRowText}>{a}</Text><Text style={[s.progressMeta,i<2&&{color:C.teal}]}>{b}</Text></View>)}
 <Text style={s.progressSection}>Co dalej</Text><View style={s.nextRow}><View><Text style={s.progressRowText}>Podtrzymanie rozmowy</Text><Text style={s.nextSub}>Następny krok, żeby rozmowa płynęła naturalnie.</Text></View><Text style={s.nextArrow}>→</Text></View>
 </ScrollView>}

export default function App(){
 const [tab,setTab]=useState('today'); const [xp,setXp]=useState(620); const dark=tab==='reels';
 return <SafeAreaView style={[s.app,dark&&{backgroundColor:C.dark}]}><View style={{flex:1,paddingBottom:62}}>{tab==='today'&&<Today xp={xp} setXp={setXp}/>} {tab==='reels'&&<Reels/>} {tab==='coach'&&<Coach/>} {tab==='progress'&&<Progress xp={xp}/>}</View><BottomNav active={tab} onChange={setTab} dark={dark}/></SafeAreaView>
}

const s=StyleSheet.create({
 app:{flex:1,backgroundColor:C.bg},page:{padding:20,paddingBottom:100},header:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},brand:{fontSize:29,fontWeight:'800',color:C.ink},stats:{flexDirection:'row',gap:5},stat:{width:55,alignItems:'center'},statValue:{fontSize:17,fontWeight:'700',color:C.ink},statLabel:{fontSize:10,color:C.muted,marginTop:2},tabsRow:{flexDirection:'row',gap:32,marginTop:22},tab:{fontSize:14,fontWeight:'700',color:C.teal},tabMuted:{fontSize:14,fontWeight:'600',color:C.muted},activeUnderline:{width:28,height:3,borderRadius:2,backgroundColor:C.teal,marginTop:9},eyebrow:{fontSize:11,fontWeight:'700',color:C.muted,marginTop:34},hero:{fontSize:35,lineHeight:40,fontWeight:'800',color:C.ink,marginTop:10},challenge:{fontSize:20,lineHeight:29,color:C.ink,marginTop:18},quoteBox:{marginTop:28,backgroundColor:C.tealSoft,borderRadius:24,paddingVertical:18,paddingHorizontal:18,flexDirection:'row',gap:14},quoteMark:{fontSize:36,fontWeight:'800',color:C.teal},quote:{fontSize:20,lineHeight:28,fontWeight:'600',color:C.ink,flex:1},support:{fontSize:15,color:C.muted,marginTop:20},cta:{height:54,borderRadius:18,backgroundColor:C.teal,alignItems:'center',justifyContent:'center',marginTop:24},ctaText:{color:C.white,fontSize:18,fontWeight:'700'},section:{fontSize:17,fontWeight:'700',color:C.ink,marginTop:34},rowBetween:{flexDirection:'row',justifyContent:'space-between',marginTop:18},link:{fontSize:16,fontWeight:'600',color:C.ink},divider:{height:1,backgroundColor:C.line,marginTop:20},micro:{fontSize:13,color:C.muted,marginTop:14},
 nav:{position:'absolute',left:0,right:0,bottom:0,height:62,flexDirection:'row',backgroundColor:'rgba(255,255,255,0.98)',borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:'rgba(0,0,0,.05)'},navDark:{backgroundColor:'rgba(8,9,9,.94)',borderTopColor:'rgba(255,255,255,.05)'},navItem:{flex:1,alignItems:'center',justifyContent:'center',paddingTop:6},navGlyph:{fontSize:17,fontWeight:'800'},navLabel:{fontSize:11,fontWeight:'600',marginTop:2},navLine:{width:20,height:3,borderRadius:2,marginTop:5,backgroundColor:'transparent'},
 reel:{backgroundColor:C.dark,position:'relative',overflow:'hidden'},fakeScene:{...StyleSheet.absoluteFillObject,backgroundColor:'#142321'},person:{position:'absolute',top:180,width:145,height:235,borderRadius:80},counter:{position:'absolute',left:0,right:0,top:425,height:145,backgroundColor:'#211B16'},reelTop:{position:'absolute',top:18,left:20,right:20},reelTitleTop:{fontSize:28,fontWeight:'800',color:C.white},reelSub:{fontSize:12,color:'#CCD1D1'},reelFilters:{flexDirection:'row',gap:34,marginTop:17},filterOn:{color:C.white,fontSize:13,fontWeight:'700'},filterOff:{color:'#B8BDBF',fontSize:13,fontWeight:'600'},play:{position:'absolute',top:'39%',left:'42%',width:64,height:64,borderRadius:32,backgroundColor:'rgba(0,0,0,.45)',alignItems:'center',justifyContent:'center'},playText:{color:C.white,fontSize:24},rail:{position:'absolute',right:13,bottom:155,alignItems:'center',gap:5},railIcon:{color:C.white,fontSize:26,fontWeight:'800',marginTop:12},railCount:{color:C.white,fontSize:10},reelBottom:{position:'absolute',left:20,right:20,bottom:20},place:{color:'#D4DBDB',fontSize:10,fontWeight:'700'},reelHeadline:{color:C.white,fontSize:28,lineHeight:31,fontWeight:'800',marginTop:8},duration:{position:'absolute',right:0,top:54,color:C.white,fontSize:13},reelCopy:{color:C.white,fontSize:15,lineHeight:21,marginTop:10,maxWidth:310},reelWho:{color:'#CCD1D1',fontSize:12,fontWeight:'600',marginTop:25},swipe:{color:'#A8B0B0',fontSize:11,marginTop:25},
 coachPage:{padding:20,paddingBottom:100},coachTitle:{fontSize:30,fontWeight:'800',color:C.ink},live:{fontSize:13,color:C.muted,marginTop:8},scenario:{height:54,borderRadius:18,backgroundColor:C.soft,flexDirection:'row',alignItems:'center',paddingHorizontal:18,marginTop:20},scenarioBold:{fontSize:13,fontWeight:'700',color:C.teal},scenarioText:{fontSize:13,color:C.ink},bubble:{borderRadius:20,paddingHorizontal:20,paddingVertical:16},userBubble:{alignSelf:'flex-end',backgroundColor:C.tealSoft,marginTop:38,minWidth:254},bubbleText:{fontSize:17,lineHeight:24,color:C.ink},coachRow:{flexDirection:'row',alignItems:'center',gap:12,marginTop:24},avatar:{width:38,height:38,borderRadius:19,backgroundColor:C.tealSoft,alignItems:'center',justifyContent:'center'},coachBubble:{backgroundColor:C.white,flex:1},suggestion:{backgroundColor:C.white,marginLeft:50,marginTop:24,flexDirection:'row',gap:12},suggestionSmall:{backgroundColor:C.white,marginLeft:50,marginTop:16,flexDirection:'row',gap:12,alignSelf:'flex-start'},spark:{fontSize:17,color:C.teal},suggestionText:{fontSize:16,lineHeight:22,color:C.ink},quickRow:{flexDirection:'row',justifyContent:'space-between',marginTop:45},quick:{backgroundColor:C.soft,borderRadius:14,paddingHorizontal:13,paddingVertical:12},quickText:{fontSize:12,color:C.ink},inputWrap:{height:58,backgroundColor:C.white,borderRadius:19,flexDirection:'row',alignItems:'center',marginTop:36,paddingLeft:18,paddingRight:8},input:{flex:1,fontSize:15,color:C.ink},send:{width:44,height:44,borderRadius:22,backgroundColor:C.teal,alignItems:'center',justifyContent:'center'},sendText:{fontSize:25,color:C.white,fontWeight:'700'},
 progressPage:{padding:20,paddingBottom:110},progressTitle:{fontSize:27,fontWeight:'800',color:C.ink,marginTop:38},progressSub:{fontSize:14,color:C.muted,marginTop:4},days:{flexDirection:'row',justifyContent:'space-between',marginTop:24},day:{alignItems:'center'},dayLabel:{fontSize:10,color:C.muted,marginBottom:10},dayDot:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'},dayDone:{backgroundColor:C.tealSoft},dayOff:{backgroundColor:C.soft},dayCheck:{color:C.teal,fontSize:14,fontWeight:'700'},dayNum:{color:C.muted,fontSize:13},bigMetric:{fontSize:31,fontWeight:'800',color:C.ink,marginTop:32},metricSub:{fontSize:16,color:C.muted},progressSection:{fontSize:20,fontWeight:'700',color:C.ink,marginTop:38},progressRow:{minHeight:62,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:C.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},progressRowText:{fontSize:16,fontWeight:'600',color:C.ink},progressMeta:{fontSize:13,fontWeight:'600',color:C.muted},nextRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:18},nextSub:{fontSize:12,color:C.muted,marginTop:4},nextArrow:{fontSize:24,color:C.teal},
});
