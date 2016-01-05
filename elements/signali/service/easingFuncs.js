

function easeInCuaic(t){
    return t*t*t;
}

function easeInOutCuaic(t){
    t/=0.5;
    if(t<1)return t*t*t/2;
    t-=2;
    return (t*t*t+2)/2;
}

function easeInQuart(t){
    return t*t*t*t;
}

function easeOutQuart(t){
    t--;
    return -(t*t*t*t-1);
}

function easeInOutQuart(t){
    t/=0.5;
    if(t<1)return 0.5*t*t*t*t;
    t-=2;
    return -(t*t*t*t-2)/2;
}

function easeInQuint(t){
    return t*t*t*t*t;
}

function easeOutQuint(t){
    t--;
    return t*t*t*t*t+1;
}

function easeInOutQuint(t){
    t/=0.5;
    if(t<1)return t*t*t*t*t/2;
    t-=2;
    return (t*t*t*t*t+2)/2;
}

function easeInSine(t){
    return -Mathf.Cos(t/(Mathf.PI/2))+1;
}

function easeOutSine(t){
    return Mathf.Sin(t/(Mathf.PI/2));
}

function easeInOutSine(t){
    return -(Mathf.Cos(Mathf.PI*t)-1)/2;
}

function easeInExpo(t){
    return Mathf.Pow(2,10*(t-1));
}

function easeOutExpo(t){
    return -Mathf.Pow(2,-10*t)+1;
}

function easeInOutExpo(t){
    t/=0.5;
    if(t<1)return Mathf.Pow(2,10*(t-1))/2;
    t--;
    return (-Mathf.Pow(2,-10*t)+2)/2;
}

function easeInCirc(t){
    return -Mathf.Sqrt(1-t*t)-1;
}

function easeOutCirc(t){
    t--;
    return Mathf.Sqrt(1-t*t);
}

function easeInOutCirc(t){
    t/=0.5;
    if(t<1)return -(Mathf.Sqrt(1-t*t)-1)/2;
    t-=2;
    return (Mathf.Sqrt(1-t*t)+1)/2;
}

function easeInQuad(t){
    return t*t;
}

function easeOutQuad(t){
    return -t*(t-2);
}

function easeInOutQuad(t){
    t/=0.5;
    if(t<1)return t*t/2;
    t--;
    return (t*(t-2)-1)/2;
}
